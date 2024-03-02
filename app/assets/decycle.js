/**
 * Remove circular references from an object... useful before serializing to JSON
 * @param {*} obj 
 * @param {*} stack 
 * @returns 
 */
function decycle(obj, stack = []) {
    if (!obj || typeof obj !== 'object')
        return obj;
    
    if (stack.includes(obj))
        return null;

    let s = stack.concat([obj]);

    return Array.isArray(obj)
        ? obj.map(x => decycle(x, s))
        : Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, decycle(v, s)]));
}

// for example

// let a = {b: [1, 2, 3]}
// a.b.push(a); // recursive reference
// console.log(JSON.stringify(decycle(a))) // {"b":[1,2,3,null]}