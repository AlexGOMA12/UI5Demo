sap.ui.define([], function() {
    "use strict";

    return {
        dateToFormat: function(phone) {
            
            phone = phone.replace(/\./g, '-');

            return phone;
        },

        removeZeros: function(number){
            let num = parseFloat(number); 
            num = num.toFixed(2);
            
            return num;
        }
    }
})