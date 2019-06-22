const getmsg = async () => {
  const dataURL = '/api/v1/data';
  const response = await fetch(dataURL);
  const json = await response[0].json();
  console.log(json);
  document.getElementById('msg').textContent = json;
}
getmsg();

login = async () => {
  const mood = document.getElementById('mood').value;
  //   video.loadPixels();
  //   const image64 = video.canvas.toDataURL();
  const data = {
    name: 1,
    phone: 2,
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }

  const res = await fetch('/store', options);
  const resData = await res.json();
  console.log(resData);
}