// Specify the URL of the PDF
const url = 'docs/ResultLetter.pdf';

// Loading the PDF.js worker explicitly
pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.js';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null,
    scale = 1.0,
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

// Load PDF
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#total-page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error loading PDF: ', error); // Log any error loading the PDF
    alert('Could not load the PDF. Please check the path or file permissions.');
});

// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        // Set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Update page counter
        document.querySelector('#current-page-num').textContent = num;
    }).catch(function(error) {
        console.error('Error rendering page: ', error);
        alert('Could not render the page. Check the PDF content.');
    });
};

// Handle page navigation
document.querySelector('#prev-page').addEventListener('click', () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
});

document.querySelector('#next-page').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
});

// Queue page rendering if another page is still rendering
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

// Handle zoom
document.querySelector('#zoom-level').addEventListener('change', e => {
    scale = e.target.value;
    renderPage(pageNum);
});
