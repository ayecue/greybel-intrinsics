const {
  Interpreter,
  Debugger,
  CustomFunction
} = require('greybel-interpreter');
const { init } = require('../dist');
const fs = require('fs');
const path = require('path');
const testFolder = path.resolve(__dirname, 'scripts');

let printMock;
const pseudoAPI = new Map();

pseudoAPI.set(
  'print',
  CustomFunction.createExternal('print', (fnCtx, self, args) => {
    // console.log(args);
    printMock(args.get('value'));
  }).addArgument('value')
);

class TestDebugger extends Debugger {
  debug() {}
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
