// Import the function (make sure the path is correct)
const { parseVersionString } = require('../content_scripts');

describe('parseVersionString', () => {

  test('parses valid version string with major and minor values', () => {
    const versionString = '24.04.5';
    const result = parseVersionString(versionString);
    expect(result).toEqual({ major: '24.04', minor: 5 });
  });

  test('parses version with multi-digit minor version', () => {
    const versionString = '23.10.12';
    const result = parseVersionString(versionString);
    expect(result).toEqual({ major: '23.10', minor: 12 });
  });

  test('parses version with minor version of 0', () => {
    const versionString = '21.06.0';
    const result = parseVersionString(versionString);
    expect(result).toEqual({ major: '21.06', minor: 0 });
  });

  test('handles version with major part being single digit', () => {
    const versionString = '01.02.1';
    const result = parseVersionString(versionString);
    expect(result).toEqual({ major: '01.02', minor: 1 });
  });

  test('throws an error for invalid version string (too short)', () => {
    const versionString = '24.5'; // Invalid format
    expect(() => parseVersionString(versionString)).toThrow();
  });

  test('throws an error for invalid version string (non-numeric minor)', () => {
    const versionString = '24.04.a';
    expect(() => parseVersionString(versionString)).toThrow();
  });

});
