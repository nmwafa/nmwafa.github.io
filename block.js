document.addEventListener('keydown', function(e) {
    const isControlOrCommand = e.ctrlKey || e.metaKey;
    const key = e.key ? e.key.toUpperCase() : '';
    const k = e.keyCode;
    if (isControlOrCommand && key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return false;
    }
    if (k === 9 || k === 35 || k === 36 || k === 37 || k === 38 || k === 39 || k === 40 || k === 123 || (isControlOrCommand && key === 'D') || (isControlOrCommand && key === 'K') || (isControlOrCommand && key === 'P') || (isControlOrCommand && key === 'O') || (isControlOrCommand && key === 'E') || (isControlOrCommand && key === 'H') || (isControlOrCommand && key === 'S') || (isControlOrCommand && key === 'U') || (isControlOrCommand && key === 'G') || (isControlOrCommand && key === 'V') || (isControlOrCommand && e.shiftKey && (key === 'I' || key === 'J' || key === 'C'))) {
        e.preventDefault();
        return false;
    }
});
