function Request () {
  this.get = function (url, cb) {
    handleRequest(url, cb, 'GET')
  }
  this.post = function (url, cb) {
    handleRequest(url, cb , 'POST')
  }
  function handleRequest (url, cb, method) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    if (method === 'POST') {
      xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    }
    xhr.onload = function () {
      if (xhr.status === 200) {
        cb(xhr.responseText);
      }
    }
    if (method === 'POST') {
      xhr.send('ip=myip');
      return
    }
    xhr.send();
  }
}

var request = new Request();


document.addEventListener('DOMContentLoaded', () => {
  requestLocalIp()
})

function requestLocalIp () {
  request.get('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json', function (address) {
    if (address) {
      request.post('http://ip.taobao.com/service/getIpInfo2.php', function (ip) {
        if (ip) {
          try {
            ip = JSON.parse(ip);
            address = JSON.parse(address);
            document.getElementById('ip').innerHTML = `
            <p>地区：${address.country}${address.province}</p>
            <p>IP： ${ip.data.ip}</p>
          `
            const opt = {
              type: 'basic',
              title: '消息提醒',
              message: '你有一条新的消息',
              iconUrl: 'images/frog-16.png',
              buttons: [
                {
                  title: '回复消息'
                },
                {
                  title: '关闭对话'
                }
              ]
            }
            console.log(chrome)
            chrome.notifications.create(null, opt, function (item) {
              chrome.notifications.onClicked.addListener(function (item) {
                console.log(item)
              })
            })
          } catch (e) {
            console.log(e);
          }
        } else {
          document.getElementById('ip').innerHTML = '地址、IP请求错误，请点击重试!';
        }
      })
    } else {
      document.getElementById('ip').innerHTML = '地址请求错误，请点击重试!';
    }
  })
}

