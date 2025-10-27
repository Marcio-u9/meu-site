const fileInput = document.getElementById('fileInput');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvasEl = document.getElementById('canvas');
const videoEl = document.getElementById('video');
const canvas = new fabric.Canvas('canvas', { backgroundColor: '#111' });

let currentFile = null;
let ffmpeg;

(async () => {
  ffmpeg = FFmpeg.createFFmpeg({ log: false });
  await ffmpeg.load();
})();

fileInput.addEventListener('change', handleFile);
clearBtn.addEventListener('click', clearEditor);
downloadBtn.addEventListener('click', downloadFile);

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  currentFile = file;
  const type = file.type;

  if (type.startsWith('image/')) {
    videoEl.style.display = 'none';
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, (img) => {
        canvas.clear();
        img.scaleToWidth(600);
        canvas.add(img);
        canvas.centerObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  } else if (type.startsWith('video/')) {
    canvas.clear();
    videoEl.style.display = 'block';
    const url = URL.createObjectURL(file);
    videoEl.src = url;
  }
}

function clearEditor() {
  canvas.clear();
  videoEl.src = '';
  fileInput.value = '';
}

async function downloadFile() {
  if (!currentFile) return alert('Nenhum arquivo carregado!');

  if (currentFile.type.startsWith('image/')) {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0
    });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'neoedit.png';
    a.click();
  } else {
    alert('Download de vídeo em breve!');
  }
}
