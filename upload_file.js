var basic = {
    //二进制转换成base64
    blob_to_base64: function(tempBlob, tempCallback) {
        var tempReader = new FileReader();
        if (!!tempBlob) {
            tempReader.readAsDataURL(tempBlob);
            tempReader.onload = function(e) {
                var tempBase64 = e.target.result,
                    tempImage = new Image(),
                    returnResult = {};
                tempImage.src = tempBase64;
                returnResult = {
                    "url": tempImage.src,
                    "width": tempImage.width,
                    "height": tempImage.height
                };
                if (!!tempCallback) {
                    tempCallback(returnResult);
                };
            };
        };
    },
    //base64转换成二进制
    base64_to_blob: function(tempBase64) {
        var arr = tempBase64.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    },
    //IE通过iframe上传文件
    upload_file_IE: function(file_dom, upload_address, call_back) {
        var iframe = document.createElement("iframe"),
            form = document.createElement("form"),
            file_dom_parent = file_dom.parentNode;
        iframe_name = "iframe_" + (new Date()).getTime() + "_" + Math.round(Math.random() * 1000),
            form_id = "form_" + (new Date()).getTime() + "_" + Math.round(Math.random() * 1000),
            temp_callback = function(obj) {
                call_back(obj);
                var iframeDom = document.getElementById(iframe_name),
                    formDom = document.getElementById(form_id);
                file_dom_parent.appendChild(file_dom);
                iframeDom.parentNode.removeChild(iframeDom);
                formDom.parentNode.removeChild(formDom);
            };
        iframe.style.display = "none";
        iframe.setAttribute("name", iframe_name);
        iframe.setAttribute("id", iframe_name);
        form.style.display = "none";
        form.setAttribute("method", "POST");
        form.setAttribute("id", form_id);
        form.setAttribute("action", upload_address);
        form.setAttribute("target", iframe_name);
        form.setAttribute("enctyped", "multipart/form-data");
        form.appendChild(file_dom);
        document.body.appendChild(form);
        document.body.appendChild(iframe);
        if (!window.upload_file_callback) {
            window.upload_file_callback = {};
        }
        //window.upload_file_callback[iframe_name] = temp_callback;
        document.getElementById(iframe_name).onload = function(e) {
            var _this = window.frames[iframe_name],
                result_string = _this.document.body.innerHTML,
                result_json = undefined;
            try {
                //result_json = JSON.parse(result_string);
                result_json = result_string;
                temp_callback(result_json);
            } catch (error) {
                window.top.console.warn(error);
            }
        };
        form.submit();
    },
    //Chrome通过FormData上传文件
    upload_file_Chrome: function(file_blob, upload_address, call_back) {
        /*mineType:multipart/form-data */
        var temp_form = new FormData();
        temp_form.append("file", file_blob);
        $.ajax({
            url: options.upload_address,
            type: "post",
            data: temp_form,
            processData: false,
            contentType: false,
            dataType: "json",
            success: call_back
        });
    }

};
