'use strict'






function vC(p, k) {
    if (p[k] != undefined && p[k] != null && p[k].length > 0) {
        return true;
    } else {
        return false;
    }
}





module.exports = {
    vC,
}