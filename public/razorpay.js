const token = localStorage.getItem('token');
document.getElementById('rzp-button12345').onclick = async function (e) {
    // console.log('i am in')
    const response = await axios.get('http://localhost:8000/purchase/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options =
    {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "name": "Test Company",
        "order_id": response.data.order.id, // For one time payment
        "prefill": {
            "name": "Test User",
            "email": "test.user@example.com",
            "contact": "7003442036"
        },
        "theme": {
            "color": "#3399cc"
        },
        // This handler function will handle the success payment
        "handler": function (response) {
            console.log(response);
            axios.post('http://localhost:8000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } }).then(() => {
                alert('You are a Premium User Now');
                window.location.href = 'premium.html';
              
            }).catch(() => {
                alert('Something went wrong. Try Again!!!')
            })
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });
}