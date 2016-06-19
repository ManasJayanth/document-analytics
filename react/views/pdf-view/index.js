const React = require('react');
const { Component } = React;
require('pdfjs-dist');

module.exports = class extends Component {
    componentDidMount() {
      var url = `./assets/pdfs/${this.props.location.query.file}`;
      PDFJS.workerSrc = './scripts/pdfjs.worker.js';
      var pdfDoc = null,
          pageNum = 1,
          pageRendering = false,
          pageNumPending = null,
          scale = 0.8,
          canvas = document.getElementById('the-canvas'),
          ctx = canvas.getContext('2d'),
          timerStart = null,
          timerEnd = null;
      /**
       * Get page info from document, resize canvas accordingly, and render page.
       * @param num Page number.
       */
      function renderPage(num) {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) {
          var viewport = page.getViewport(scale);
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          // Wait for rendering to finish
          renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
              // New page rendering is pending
              renderPage(pageNumPending);
              pageNumPending = null;
            }
          });
        });
        // Update page counters
        document.getElementById('page_num').textContent = pageNum;

        // Start timer
        timerStart = new Date();
      }
      /**
       * If another page rendering in progress, waits until the rendering is
       * finised. Otherwise, executes rendering immediately.
       */
      function queueRenderPage(num) {
        if (pageRendering) {
          pageNumPending = num;
        } else {
          renderPage(num);
        }
      }
      /**
       * Displays previous page.
       */
      function onPrevPage() {
        // End timer
        logTimeRead();
        if (pageNum <= 1) {
          return;
        }
        pageNum--;
        queueRenderPage(pageNum);
      }
      document.getElementById('prev').addEventListener('click', onPrevPage);
      /**
       * Displays next page.
       */
      function onNextPage() {
        logTimeRead();
        if (pageNum >= pdfDoc.numPages) {
          return;
        }
        pageNum++;
        queueRenderPage(pageNum);
      }
      function logTimeRead() {
        timerEnd = new Date();
        if (timerStart !== null) {
          console.log(`Page ${pageNum} read for ${timerEnd - timerStart} milliseconds`);
        }
      }
      document.getElementById('next').addEventListener('click', onNextPage);
      /**
       * Asynchronously downloads PDF.
       */
      PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;
        // Initial/first page rendering
        renderPage(pageNum);
      });
    }
    render() {
        return (
          <div className="pyk-pdfjs">
            <div className="pyk-button">
              <button id="prev">Previous</button>
              <button id="next">Next</button>
              <div className="pyk-page-num">
                Page: <span id="page_num"></span> / <span id="page_count"></span>
              </div>
            </div>
            <div>
              <canvas id="the-canvas" style={{"border":"1px solid black"}}></canvas>
            </div>
          </div>
        );
    }
};
