document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {});
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems);
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
   
    checkSelectedPage()
    document.addEventListener('DOMSubtreeModified', function () {
      checkSelectedPage()
    });

    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {accordion: false});
  });

  function checkSelectedPage(){
    let pages = ['news', 'calendar', 'tasklist', 'mail']
    let link = window.location.href;

    pages.forEach(element => {
      if (link.includes('main:' + element)){
        pages.forEach(element => {
          document.getElementById(element).className = ''
        });
        document.getElementById(element).className = 'selected'
      }
    });
  }

  function openModal(id) {
    var elems = document.querySelectorAll('.modal');
    console.log(elems.length);
    var instances = M.Modal.init(elems);
    if(id == -1) instances[instances.length-1].open();
    else
      instances[id].open();
  }

  function closeModal(id) {
    var elems = document.querySelectorAll('.modal');
    var instance = M.Modal.getInstance(elems[id]);
    instance.close();
  }

  function setDate(date, id) {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.getInstance(elems[id]);
    instances.setDate (new Date(date));
    instances._finishSelection();
  }

  function setTime(dateS, id) {
    var elems = document.querySelectorAll('.timepicker');
    let date = new Date(dateS);
    let t = date.getHours() > 12;
    let hours = (t) ? date.getHours() - 12 : date.getHours();
    let output = ((hours > 9) ? hours.toString() : "0" + hours);
    output += ":";
    output += (date.getMinutes() > 9) ? date.getMinutes().toString() : "0" + date.getMinutes();
    output += " ";
    output += (t) ? "PM" : "AM";
    console.log(output);
    let timeInstance = M.Timepicker.init(elems[id], {
      defaultTime: output
    });
    timeInstance._updateTimeFromInput();
    timeInstance.done();
  }

  function selectValues(select) {
    return M.FormSelect.getInstance(select).getSelectedValues();
  }

  function showToast(text) {
    M.toast({html: text});
  }