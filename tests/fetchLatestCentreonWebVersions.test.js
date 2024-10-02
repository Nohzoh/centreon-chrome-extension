// import necessary libraries
const { fetchLatestCentreonWebVersions } = require('../content_scripts');

describe('fetchLatestCentreonWebVersions', () => {

  // Helper function to mock fetch response
  const mockFetchResponse = (status, data) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status === 200,
        status,
        json: () => Promise.resolve(data)
      })
    );
  };

  // Test 1: Successful fetch with valid Centreon-web releases
  it('should return the highest minor versions for each major version', async () => {
    const mockReleases = [
      { name: 'centreon-web-22.04.0' },
      { name: 'centreon-web-22.04.1' },
      { name: 'centreon-web-22.10.0' },
      { name: 'centreon-web-21.10.0' }
    ];

    mockFetchResponse(200, mockReleases);

    const result = await fetchLatestCentreonWebVersions();

    expect(result).toEqual({
      '22.10': 0,
      '22.04': 1,
      '21.10': 0
    });
  });
});
