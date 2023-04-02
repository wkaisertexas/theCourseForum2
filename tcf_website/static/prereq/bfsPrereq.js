function reverse_dict(pre_adjl){
    let postreq = new Map();

    for (const [key, value] of Object.entries(math_prereqs)) {
        for(const listy of value){
            for(const val of listy){
                if(!postreq.has(val))
                    postreq.set(val, []);
                postreq.get(val).push(key);
            }
        }    
    }
    return postreq;
}



function BFS(start, adjl) {
   // Create a Queue and add our initial node in it
   let fringe = [];
   let visited = new Set();
   
   fringe.push(start);
   // Mark the first node as explored explored.
   // We'll continue till our queue gets empty
   visited.add(start);
   while (fringe.length != 0) {
        const node = fringe.shift();
        // Log every element that comes out of the Queue
        console.log(node);
        // 1. In the edges object, we search for nodes this node is directly connected to.
        // 2. We filter out the nodes that have already been explored.
        // 3. Then we mark each unexplored node as explored and add it to the queue.
        if(adjl[node] == null || adjl[node].length == 0)
            continue;
        for(let children = 0; children < adjl[node].length; children++){
            for(let child = 0; child < adjl[node][children].length; child++){
                const child_name = adjl[node][children][child];
                if(visited.has(child_name)) // * POTENTIAL ISSUE TICKET: we don't allow duplicates. might be sketch *
                    continue;
                
                visited.add(child_name);
                fringe.push(child_name);
            }
        }
    }
   
}


function BFS_postreq(start, adjl){
    let fringe = [];
    let visited = new Set();
    
    fringe.push(start);
    visited.add(start);

    while(fringe.length != 0){
        const node = fringe.shift();
        
        console.log(node);
        if(adjl.get(node) == null || adjl.get(node).length == 0)
            continue;
        
        for(let children = 0; children < adjl.get(node).length; children++){
            // for(let child = 0; child < adjl.get(node)[children].length; child++){
            const child_name = adjl.get(node)[children];
            if(visited.has(child_name)) // * POTENTIAL ISSUE TICKET: we don't allow duplicates. might be sketch *
                continue;
            
            visited.add(child_name);
            fringe.push(child_name);
        }
    }
}




// // Sample runs:

// const math_prereqs = {
//     "MATH1140": [],
//     "MATH1190": [],
//     "MATH1210": [],
//     "MATH1220": [
//         ["MATH1210"]
//     ],
//     "MATH1310": [],
//     "MATH1320": [
//         ["MATH1310"]
//     ],
//     "MATH2310": [
//         ["MATH1320"]
//     ],
//     "MATH2315": [],
//     "MATH3000": [
//         ["MATH1320"]
//     ],
//     "MATH3100": [
//         ["MATH1320", "MATH2310"]
//     ],
//     "MATH3250": [
//         ["MATH1320"]
//     ],
//     "MATH3310": [
//         ["MATH1320"]
//     ],
//     "MATH3350": [],
//     "MATH3351": [
//         ["MATH1320"]
//     ],
//     "MATH3354": [
//         ["MATH1320"]
//     ],
//     "MATH4900": [],
//     "MATH4993": [],
//     "MATH8999": [],
//     "MATH9995": [],
//     "MATH9998": [],
//     "MATH9999": [],
//     "MATH1150": [],
//     "MATH3340": [
//         ["MATH2310"]
//     ],
//     "MATH4040": [
//         ["MATH1320"],
//         ["MATH3000", "MATH3310", "MATH3354"]
//     ],
//     "MATH4110": [
//         ["MATH3100"],
//         ["MATH3351"]
//     ],
//     "MATH4140": [
//         ["MATH3100", "MATH3351"],
//         ["MATH3000", "MATH3310", "MATH3354"]
//     ],
//     "MATH4220": [
//         ["MATH3250"],
//         ["MATH3351", "MATH4210"]
//     ],
//     "MATH4300": [
//         ["MATH3250"]
//     ],
//     "MATH4310": [
//         ["MATH3310"]
//     ],
//     "MABTH4651": [
//         ["MATH3351"]
//     ],
//     "MATH4720": [
//         ["MATH2310", "MATH3250"],
//         ["MATH3351"]
//     ],
//     "MATH4770": [
//         ["MATH2310", "MATH3310"],
//         ["MATH3351"]
//     ],
//     "MATH5653": [
//         ["MATH3354"]
//     ],
//     "MATH5896": [],
//     "MATH7000": [],
//     "MATH7340": [],
//     "MATH7370": [],
//     "MATH7410": [
//         ["MATH7340"],
//         ["MATH7310"]
//     ],
//     "MATH7559": [],
//     "MATH7600": [
//         ["MATH5770"]
//     ],
//     "MATH7751": [
//         ["MATH5651", "MATH5652"]
//     ],
//     "MATH7810": [
//         ["MATH7800"]
//     ],
//     "MATH7820": [
//         ["MATH5310", "MATH5770"]
//     ],
//     "MATH7900": [],
//     "MATH8510": [],
//     "MATH8559": [],
//     "MATH8620": [],
//     "MATH8852": [],
//     "MATH8855": [],
//     "MATH8880": [],
//     "MATH8998": [],
//     "MATH9010": [],
//     "MATH9250": [],
//     "MATH9310": [],
//     "MATH9360": [],
//     "MATH9410": [],
//     "MATH9820": [],
//     "MATH9950": [],
//     "MATH3315": [
//         ["MATH2315"]
//     ],
//     "MATH4901": [
//         ["MATH4900"]
//     ],
//     "MATH1110": [],
//     "MATH1160": [],
//     "MATH4250": [
//         ["MATH3351", "APMA3080"],
//         ["MATH3310", "MATH4310"]
//     ],
//     "MATH4330": [
//         ["MATH2310", "MATH2315"]
//     ],
//     "MATH4652": [
//         ["MATH3351", "MATH4651"],
//         ["MATH3354"]
//     ],
//     "MATH4660": [],
//     "MATH4750": [
//         ["MATH2310"],
//         ["MATH3351"],
//         ["MATH3354"]
//     ],
//     "MATH4840": [],
//     "MATH5030": [
//         ["MATH2310"],
//         ["MATH3354"]
//     ],
//     "MATH5080": [
//         ["MATH1320", "MATH3351"],
//         ["MATH3000", "MATH3310", "MATH3354"]
//     ],
//     "MATH5700": [
//         ["MATH2310", "MATH3351"]
//     ],
//     "MATH7010": [],
//     "MATH7310": [
//         ["MATH5310"]
//     ],
//     "MATH7752": [
//         ["MATH5651", "MATH5652"]
//     ],
//     "MATH7800": [
//         ["MATH5352", "MATH5770"]
//     ],
//     "MATH7830": [
//         ["MATH7800"]
//     ],
//     "MATH8310": [],
//     "MATH8410": [],
//     "MATH8450": [],
//     "MATH8720": [],
//     "MATH8750": [
//         ["MATH5770"]
//     ],
//     "MATH8851": [],
//     "MATH8853": []
// }
// math_postreqs = reverse_dict(math_prereqs);

// console.log("Postreq test on MATH1310:\n");
// BFS_postreq("MATH1310", math_postreqs);

// console.log("Postreq test on MATH3100:\n");
// BFS("MATH3100", math_prereqs);