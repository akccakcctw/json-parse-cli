import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execAsync = promisify(exec);

describe('cli.js', () => {
  const cliPath = path.resolve('./cli.js');
  const samplePath = path.resolve('./__tests__/sample.json');

  test('should display help when no arguments are provided', async () => {
    const { stdout } = await execAsync(`node ${cliPath} --help`);
    expect(stdout).toMatch(/Usage:/);
  });

  test('should display version when --version flag is provided', async () => {
    const { stdout } = await execAsync(`node ${cliPath} --version`);
    expect(stdout).toMatch(/\d+\.\d+\.\d+/); // Assuming version is in the format x.x.x
  });

  test('should parse JSON from stdin', async () => {
    const { stdout } = await execAsync(`echo '{"test": "value"}' | node ${cliPath}`);
    expect(stdout).toContain('test');
    expect(stdout).toContain('value');
  });

  // Add more tests as needed...
});
