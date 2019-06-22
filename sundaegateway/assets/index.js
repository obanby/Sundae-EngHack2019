const getmsg = async () => {
  const dataURL = '/api/v1/data';
  const response = await fetch(dataURL);
  const json = await response.json();
  console.log(json);
  document.getElementById('message').textContent = json;
}
getmsg();

login = async () => {
  const mood = document.getElementById('mood').value;
  //   video.loadPixels();
  //   const image64 = video.canvas.toDataURL();
  const data = {
    phone: 2,
    password: 3,
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }

  const res = await fetch('/login', options);
  const resData = await res.json();
  console.log(resData);
}