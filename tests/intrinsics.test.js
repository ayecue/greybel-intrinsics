const {
  Debugger,
  CustomFunction,
  OutputHandler,
  HandlerContainer,
  CustomString,
  DefaultType
} = require('greybel-interpreter');
const {
  Interpreter
} = require('greyscript-interpreter');
const { init } = require('../dist');
const fs = require('fs');
const path = require('path');
const testFolder = path.resolve(__dirname, 'scripts');
const wait = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));

let printMock;
const pseudoAPI = new Map();

global.Math.random = () => .5;

pseudoAPI.set(
  new CustomString('print'),
  CustomFunction.createExternal(
    'print',
    async (ctx, self, args) => {
      ctx.handler.outputHandler.print(ctx, args.get('value').toString());
    }
  ).addArgument('value')
);

pseudoAPI.set(
  new CustomString('typeof'),
  CustomFunction.createExternal(
    'print',
    (ctx, self, args) => {
      return Promise.resolve(args.get('value').getCustomType());
    }
  ).addArgument('value')
);

class TestOutputHandler extends OutputHandler {
  print(_ctx, message) {
    printMock(message);
  }
}

class TestDebugger extends Debugger {
  debug() { }
}

describe('interpreter', function () {
  beforeEach(function () {
    printMock = jest.fn();
  });

  describe('default scripts', function () {
    fs.readdirSync(testFolder).forEach((file) => {
      const filepath = path.resolve(testFolder, file);

      test(path.basename(filepath), async () => {
        const interpreter = new Interpreter({
          target: filepath,
          api: init(pseudoAPI),
          handler: new HandlerContainer({
            outputHandler: new TestOutputHandler()
          }),
          debugger: new TestDebugger()
        });
        let success = false;

        try {
          await interpreter.run();
          success = true;
        } catch (e) {
          console.log(`${filepath} failed with: `, e);
        }

        expect(success).toEqual(true);
        for (const call of printMock.mock.calls) {
          expect(call[0]).toMatchSnapshot();
        }
      });
    });
  });
});
