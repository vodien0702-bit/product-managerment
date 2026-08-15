tinymce.init({
  selector: 'textarea.tiny-mce',
  plugins: 'image link code',
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | image link | code',
  license_key: 'gpl',

  // Chỉ định áp dụng file picker cho loại 'image' (hoặc 'media', 'file')
  file_picker_types: 'image',

  // Hàm mở trình chọn file từ local máy tính
  file_picker_callback: (cb, value, meta) => {
    // 1. Tạo một thẻ input file ẩn
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    // 2. Lắng nghe sự kiện khi người dùng chọn xong file từ máy
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
          3. Đăng ký ảnh dạng Blob vào bộ nhớ đệm (blobCache) của TinyMCE
          để hiển thị preview và tự động upload lên server nếu có images_upload_url / images_upload_handler
        */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        // 4. Gọi callback để điền link blob tạm và tên file vào ô Source / Title
        cb(blobInfo.blobUri(), { title: file.name });
      });

      reader.readAsDataURL(file);
    });

    // 5. Tự động click để mở cửa sổ chọn file của hệ điều hành
    input.click();
  }
});