document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, {});
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    var elems = document.querySelectorAll('.timepicker');
    var instances = M.Timepicker.init(elems);
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {});
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
   
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
    var instances = M.Modal.init(elems);
    if(id == -1) instances[instances.length-1].open();
    else
      instances[id].open();
  }

  function openModalById(id) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    for(let i=0;i<instances.length;i++) 
      if(instances[i].id == id)
        openModal(i);
  }

  function closeModal(id) {
    var elems = document.querySelectorAll('.modal');
    var instance = M.Modal.getInstance(elems[id]);
    instance.close();
  }

  function closeModalById(id) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    for(let i=0;i<instances.length;i++) 
      if(instances[i].id == id)
        closeModal(i);
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

  function setMinimumDateForDatePicker() {
    let temp = document.querySelectorAll(".datepicker");
    M.Datepicker.init(temp, {minDate: new Date()});
  }

  function getEventsValue(event) {
    console.log(event.target.value);
    return event.target.value;
  }