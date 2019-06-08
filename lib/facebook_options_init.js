var facebookFilterOptions = new FacebookFilter.Options();

window.onload = function() {
  facebookFilterOptions.init();

  document.getElementById('addButton').addEventListener('click', function() {
    facebookFilterOptions.addKey(new_key.value);
  });
};
