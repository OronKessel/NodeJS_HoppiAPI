

//   zendesk.tickets.list().then(function(tickets){
//     console.log(tickets);
//   });

//   // List all tickets and sort by status and order descendent
//   // https://developer.zendesk.com/rest_api/docs/core/tickets#list-tickets

//   zendesk.tickets.list('sort_by=status&sort_order=desc').then(function(tickets){
//     console.log(tickets);
//   });

//   // Show a single ticket

//   zendesk.tickets.show(TICKET_ID).then(function(ticket){
//     console.log(ticket);
//   });

//   // Create a ticket

//   zendesk.tickets.create({
//     subject: 'A new ticket',
//     comment: {
//       body: 'A ticket created with zendesk-node-api'
//     }
//   }).then(function(result){
//     console.log(result);
//   });

//   // Update a ticket

//   zendesk.tickets.update(TICKET_ID, {
//     subject: 'An updated subject'
//   }).then(function(result){
//     console.log(result);
//   });

//   // Delete a ticket

//   zendesk.tickets.delete(TICKET_ID).then(function(result){
//     // result == true
//   });

//   // List all open tickets

//   zendesk.search.list('query=type:ticket status:open').then(function(results){
//     console.log(results);
//   });