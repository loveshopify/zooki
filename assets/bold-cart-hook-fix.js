function fixHooks() {
if (BOLD && BOLD.common) {
var forms = document.querySelectorAll('.boldForm');
forms.forEach(function(form, index){
if (index != 0) {
var formTotalHooks = form.querySelectorAll('.bold_cart_item_total');
formTotalHooks.forEach(function(hook){
hook.classList.value = "Bold-theme-hook-DO-NOT-DELETE bold_cart_item_total_" + (index + 1);
})
var formPriceHooks = form.querySelectorAll('.bold_cart_item_price');
formPriceHooks.forEach(function(hook){
hook.classList.value = "Bold-theme-hook-DO-NOT-DELETE bold_cart_item_price_" + (index + 1);
})
}
})
BOLD.common.eventEmitter.emit('BOLD_COMMON_cart_loaded');
}
}
