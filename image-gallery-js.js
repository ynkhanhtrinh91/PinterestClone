// Biến toàn cục
let currentImageUrl = null; // Biến lưu trữ URL của ảnh đang xử lý
let currentFileIndex = 0; // Biến để theo dõi file hiện tại khi xử lý nhiều file
let selectedFiles = []; // Mảng lưu trữ các file được chọn

// Hàm tạo item từ dữ liệu
function createGalleryItem(imageUrl, title, description) {
    const item = document.createElement('div');
    item.className = 'item';
    const img = document.createElement('img');
    img.src = imageUrl || 'placeholder.jpg'; // Nếu không có imageUrl, dùng ảnh placeholder
    img.alt = title;
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Tải xuống';
    item.appendChild(img);
    item.appendChild(titleElement);
    item.appendChild(descriptionElement);
    item.appendChild(saveBtn);
    return item;
}

// Hàm kích hoạt input file ẩn
function triggerFileInput() {
    const input = document.getElementById('imageInput');
    input.click();
}

// Hàm hiển thị modal với preview ảnh
function showModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const preview = document.getElementById('imagePreview');
    preview.src = imageUrl;
    preview.style.display = 'block';
    modal.style.display = 'flex';
}

// Hàm đóng modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    const preview = document.getElementById('imagePreview');
    modal.style.display = 'none';
    preview.style.display = 'none';
    preview.src = '';
    document.getElementById('imageForm').reset();
}

// Hàm xử lý khi người dùng chọn file
function handleFileSelect(event) {
    selectedFiles = Array.from(event.target.files);
    currentFileIndex = 0;
    if (selectedFiles.length === 0) {
        alert("Vui lòng chọn ít nhất một ảnh!");
        return;
    }
    processNextFile();
}

// Hàm xử lý từng file
function processNextFile() {
    if (currentFileIndex >= selectedFiles.length) {
        selectedFiles = [];
        currentFileIndex = 0;
        document.getElementById('imageInput').value = '';
        return;
    }
    const file = selectedFiles[currentFileIndex];
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageUrl = e.target.result;
        showModal(currentImageUrl);
    };
    reader.readAsDataURL(file);
}

// Hàm xử lý khi người dùng submit form trong modal
function submitImage() {
    const title = document.getElementById('imageTitle').value;
    const description = document.getElementById('imageDescription').value;

    if (!title || !description) {
        alert("Vui lòng nhập đầy đủ tiêu đề và mô tả!");
        return;
    }

    const gallery = document.getElementById('gallery');
    const item = createGalleryItem(currentImageUrl, title, description);
    gallery.appendChild(item);

    closeModal();
    currentFileIndex++;
    processNextFile();

    // Gọi lại hàm để thêm sự kiện tải xuống cho nút mới
    addDownloadEvent();
}

// Hàm xử lý khi người dùng nhấn "Hủy"
function cancelImage() {
    closeModal();
    currentFileIndex++;
    processNextFile();
}

// Hàm thêm sự kiện tải xuống cho các nút "Tải xuống"
function addDownloadEvent() {
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.item'); // Tìm thẻ cha .item
            const img = item.querySelector('img'); // Lấy thẻ img trong .item
            const imgSrc = img.src; // Lấy đường dẫn hình ảnh
            const imgAlt = img.alt || 'downloaded-image'; // Lấy tiêu đề ảnh để đặt tên file, mặc định là 'downloaded-image'

            // Tạo một thẻ <a> ẩn để tải ảnh
            const link = document.createElement('a');
            link.href = imgSrc;
            link.download = imgAlt.replace(/\s+/g, '_') + '.jpg'; // Đặt tên file tải về (thay khoảng trắng bằng dấu gạch dưới)
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Xóa thẻ <a> sau khi tải
        });
    });
}

// Hàm xử lý tìm kiếm dựa trên tiêu đề
function handleSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        const items = document.querySelectorAll('.item');

        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const desc = item.querySelector('p').textContent.toLowerCase();
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                item.style.display = 'block'; // Hiển thị nếu tiêu đề hoặc mô tả chứa từ khóa
            } else {
                item.style.display = 'none'; // Ẩn nếu không khớp
            }
        });
    });
}

// Gắn sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('imageInput');
    input.addEventListener('change', handleFileSelect);
    addDownloadEvent(); // Gọi hàm để thêm sự kiện tải xuống cho các nút có sẵn
    handleSearch(); // Gọi hàm để xử lý tìm kiếm
});

function loadRandomImages() {
    for (let i = 1; i <= 8; i++) {
        document.getElementById(`img${i}`).src = `https://picsum.photos/200/200?random=${Math.random()}`;
    }
}

// Gọi hàm khi trang tải
window.onload = loadRandomImages;
