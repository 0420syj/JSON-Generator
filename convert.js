const inputForm = document.querySelector("#input-form")
const dataInput = document.querySelector("#input-form textarea")
const fileName = document.querySelector("#input-form input")
const h2Title = document.querySelector("#title")

function onDownload(event) {
  event.preventDefault()
  let data;
  try {
    data = JSON.parse(dataInput.value)
  }
  catch {
    h2Title.classList.toggle("normal")
    h2Title.classList.toggle("error")
    setTimeout(function () {
      h2Title.classList.toggle("error")
      h2Title.classList.toggle("normal")
    }, 1500)
    return
  }
  const filename = fileName.value
  const result = processData(data)

  download(result, filename, 'application/json')
}

function download(data, filename, type) {
  const file = new Blob([data], { encoding: "UTF-8", type: type })
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename)
  else { // Others
    const a = document.createElement("a"),
      url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

function processData(data) {
  let output = []
  for (let i = 0; i < data.length; i++) {
    let json = {}
    json.id = data[i].openMajorCode + '-' + data[i].openGrade + '-' + data[i].openGwamokNo + '-' + data[i].bunbanNo
    json.title = data[i].gwamokKname
    json.type = data[i].codeName1
    json.credit = data[i].hakjumNum + '/' + data[i].sisuNum
    json.prof = (data[i].memberName ? data[i].memberName : "null")
    json.hasSyllabus = (data[i].summary ? true : false)
    let selectSubj = data[i].thisYear + data[i].hakgi + data[i].openGwamokNo + data[i].openMajorCode + data[i].bunbanNo + data[i].openGrade
    json.link = 'https://klas.kw.ac.kr/std/cps/atnlc/LectrePlanStdView.do?selectSubj=U' + selectSubj + '&selectYear=' + data[i].thisYear + '&selecthakgi=' + data[i].hakgi

    output.push(json)
  }
  return JSON.stringify(output)
}

function getSemester() {
  const month = new Date().getMonth() + 1
  if (month >= 7 && month <= 12) return 2
  else return 1
}

inputForm.addEventListener("submit", onDownload)
fileName.value = new Date().getFullYear() + '-' + getSemester()