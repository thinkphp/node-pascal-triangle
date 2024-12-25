const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Function to compute Pascal's Triangle
function computePascalsTriangle(rows) {
  const triangle = [];
  for (let i = 0; i < rows; i++) {
    const row = [1];
    for (let j = 1; j < i; j++) {
      row.push(triangle[i - 1][j - 1] + triangle[i - 1][j]);
    }
    if (i > 0) row.push(1);
    triangle.push(row);
  }
  return triangle;
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query);

  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    // Serve the HTML form
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Pascal's Triangle Generator</h1>
      <form action="/pascal" method="get">
        <label for="rows">Enter the number of rows:</label>
        <input type="number" id="rows" name="rows" min="1" required>
        <button type="submit">Generate</button>
      </form>
    `);
  } else if (req.method === 'GET' && parsedUrl.pathname === '/pascal') {
    // Handle Pascal's Triangle generation
    const rows = parseInt(queryParams.rows, 10);
    if (isNaN(rows) || rows < 1) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>Invalid input! Please enter a positive number.</h1><a href="/">Go Back</a>');
      return;
    }

    const triangle = computePascalsTriangle(rows);
    const formattedTriangle = triangle.map(row => row.join(' ')).join('<br>');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Pascal's Triangle</h1>
      <pre style="font-family:monospace;">${formattedTriangle}</pre>
      <br>
      <a href="/">Go Back</a>
    `);
  } else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
