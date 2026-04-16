document.addEventListener("DOMContentLoaded", function () {
  const options = document.querySelectorAll(".quiz-option");
  const nextBtn = document.getElementById("next-button");

  console.log("JS loaded");
  console.log("Options:", options.length);

  options.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove previous selection
      options.forEach((opt) => opt.classList.remove("selected"));

      // Add to clicked
      option.classList.add("selected");

      // Show next button
      nextBtn.classList.add("show");
    });
  });
});
