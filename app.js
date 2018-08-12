import DataBind from './DataBind.js'

const data = {
  content: {
    text: 'hello, <strong>there</strong>',
    visible: true
  }
}

const update = data => {
  document.querySelector('.content').innerHTML = app.data.content.text
  document.querySelector('.content').style.display = app.data.content.visible ? 'block' : 'none'
  document.querySelector('.toggle').textContent = app.data.content.visible ? 'Hide' : 'Show'
}

const app = new DataBind({data, update})

document.querySelector('.toggle').addEventListener('click', function (e) {
  const visible = !app.data.content.visible
  app.set({
    content: {visible}
  }).then(data => {
    console.log(data)
  })
})
