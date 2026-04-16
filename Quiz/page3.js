const options = document.querySelectorAll(".quiz-option");
const nextBtn = document.getElementById("next-button");

options.forEach((option) => {
  option.addEventListener("click", () => {
    options.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
    nextBtn.classList.add("show");
  });
});
