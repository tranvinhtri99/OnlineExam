export const addIndex = (list) =>
    list.map((item, i) => ({
        index: i + 1,
        data: item
    }));

export const callbackResponse = (response, onSuccess = null, onError = showError) => {
    if (response.type == 0) {
        if (onSuccess) {
            onSuccess(response.data);
            return response;
        }

    } else {
        if (onError) {
            onError(response.error)
        }
    }
}

export const replace = (list, index, item) => list.map((x, i) => i == index ? item : x);


export const tryAddElement = (list, fnPredict, item) => {
    let hasAdd = true;
    return list.map(x => {
        if (fnPredict(x)) {
            hasAdd = false;
            return item;
        }
        return x;
    })
}

export const linQWhere = (list, fnPredict) => {
    return list.filter(fnPredict);
}

export const linQSelect = (list, fnPredict) => {
    return list.map(fnPredict);
}

const showError = (error) => {
    alert(error.Message);
}

export function removeLastItem(data) {
    data.pop();
    return data;
}


  export const downloadFile = (response, filename) => {
    Promise.resolve(response())
        .then(blob => {

            var data = new Blob([blob], {type: 'text/csv'});
        var csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', filename);
        tempLink.click();
        })
        .catch(e => {
            console.log(e);
            alert(`Cannot download file ${filename}`)
        });
}