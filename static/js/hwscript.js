//CLEAR button
function reset_func() {
    document.getElementById("form").reset()
    document.getElementById("table_div").style.display = "none";
    document.getElementById("info_div").style.display = "none";
}

//checkbox disable Location textbox
function check_f() {
    check_click = document.getElementById('check_button').checked
    if (check_click == true) {
        document.getElementById('location').disabled = true;
        document.getElementById("form").reset()
    }
    else if (check_click == false) {
        document.getElementById('location').disabled = false;
    }

}
//form listener
var tmp = document.getElementById("form");
function handleForm(event) { event.preventDefault(); }
tmp.addEventListener('submit', handleForm);

//get infomation of a business


async function get_detail_data(id) {
    try {
        //axios
        const res = await axios.get('/detail', {
            params: {
                id: id
            }
        });
        var yelp_data = res.data;
        if (yelp_data == null) {
            console.log('None')

        }
        addr1 = yelp_data['location']['address1'];
        state = yelp_data['location']['state'];
        addr2 = yelp_data['location']['zip_code'];

        address_full = addr1 + ', ' + state + ' ' + addr2;
        phone = yelp_data['display_phone'];
        price_ = yelp_data['price'];
        trans = yelp_data['transactions'];

        let transactions = '';
        if (trans == 'delivery') {
            transactions += 'Delivery';
        }
        else if (trans == 'pickup') {
            transactions += 'Pick-up';
        }
        else if (trans == 'restaurant_reservation') {
            transactions += 'Pick-up';
        }
        else if (trans == 'delivery,restaurant_reservation') {
            transactions += 'Delivery | Pick-up'
        }
        else if (trans == 'pickup,restaurant_reservation') {
            transactions += 'Delivery | Pick-up'
        }
        else if (trans == 'delivery,pickup') {
            transactions += 'Delivery | Pick-up'
        }
        else {
            transactions += 'No Information'
        }



        b_id = yelp_data['id'];
        more_info = yelp_data['url'];
        //is_close = yelp_data['businesses'][i]

        var close = yelp_data['hours'][0]['is_open_now'];

        let is_close = '';
        if (close == true) {
            is_close += 'Open Now';
            document.getElementById('s_ans').style.backgroundColor = 'green';
        }
        else if (close == false) {
            is_close += 'Closed';
            document.getElementById('s_ans').style.backgroundColor = 'red';
        }

        let catego = '';
        cat = yelp_data['categories'];
        for (var j = 0; j < cat.length; j++) {
            cate = yelp_data['categories'][j]['title'];
            catego += cate;
            if (j < cat.length - 1) {
                catego += ' | ';
            }
        }
        document.getElementById('info').scrollIntoView();
        document.getElementById('title').innerHTML = yelp_data['name'];

        document.getElementById("info_div").style.display = "block";

        document.getElementById('status').innerHTML = 'Status';
        document.getElementById('s_ans').innerHTML = is_close;

        document.getElementById('catego').innerHTML = 'Category';
        document.getElementById('c_ans').innerHTML = catego;

        document.getElementById('address').innerHTML = 'Address';
        document.getElementById('a_ans').innerHTML = address_full;

        document.getElementById('phone').innerHTML = 'Phone Number';
        document.getElementById('p_ans').innerHTML = phone;

        document.getElementById('transctions').innerHTML = 'Transctions';
        document.getElementById('t_ans').innerHTML = transactions;

        document.getElementById('price').innerHTML = 'Price';
        document.getElementById('pr_ans').innerHTML = price_;
        document.getElementById('more').innerHTML = 'More info';
        document.getElementById('m_ans').innerHTML = '<a href = \'' + more_info + '\' target="_blank" >  Yelp </a>';

        var img_cell = document.getElementById('p1');
        img_url = yelp_data['photos'][0];
        img_cell.innerHTML = "<div><img src=" + img_url + " id= 'img1'>"

        var img_cell2 = document.getElementById('p2');
        img_url2 = yelp_data['photos'][1];
        img_cell2.innerHTML = "<div><img src=" + img_url2 + " id='img2'>"

        var img_cell3 = document.getElementById('p3');
        img_url3 = yelp_data['photos'][2];
        img_cell3.innerHTML = "<div><img src=" + img_url3 + " id='img3'>";

        var pid1 = document.getElementById('pid1');
        pid1.innerHTML = 'Photo 1';


        var pid2 = document.getElementById('pid2');
        pid2.innerHTML = 'Photo 2';


        var pid3 = document.getElementById('pid3');
        pid3.innerHTML = 'Photo 3';

    } catch (e) {
        console.log('ERROR', e);
    };
};


//SUBMIT FUNCTION
async function testfuc() {
    try {
        let keywords = document.getElementById('keywords').value;

        //let distancem = document.getElementById('distance').value;
        //if (distancem.trim() == '') {
        //distance = 16090;}

        //let distance = Number(distancem) * 1609;//
        let distance == 16090;
        console.log(distance)
        console.log('Hello Word')
        let category = document.getElementById('category').value;
        let location = document.getElementById('location').value;
        check_click = document.getElementById('check_button').checked;

        if (check_click == true) {
            //ipinfo
            let ip_url = 'https://ipinfo.io/json?token=e06090c82c5936'
            const ip_d = await fetch(ip_url).then(result => result.json());
            var ip_data = ip_d.loc.split(',').map(Number)
            lat = ip_data[0];
            lng = ip_data[1];

        }
        else if (check_click == false) {
            //gmap api
            let gmap_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=AIzaSyBpxcfUsnbsG4VIuN7_QScYSoyso_NSbQM'
            const gmap_data = await fetch(gmap_url).then(result => result.json());
            lat = parseFloat(gmap_data['results'][0]['geometry']['location']['lat']);
            lng = parseFloat(gmap_data['results'][0]['geometry']['location']['lng']);
        }

        //axios
        const res = await axios.get('/submit', {
            params: {
                keywords: keywords,
                distance: 16090,
                category: category,
                longitude: lng,
                latitude: lat
            }
        });

        var yelp_data = res.data
        //console.log(yelp_data);

        if (yelp_data['total'] == 0) {
            document.getElementById('table_div').style.display = "none";

            document.getElementById("info_div").style.display = "none";
            document.getElementById('no_info').style.display = "block";
            document.getElementById('no_info').innerHTML = 'No record has been founds'

        }
        else {
            var node = document.getElementById("data_tbody");
            document.getElementById('no_info').style.display = "none";
            while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
            }


            document.getElementById('table_div').style.display = "block";
            // table_d = '/#table_div';
            //window.Location = table_d

            var data_table = document.getElementById('data_tbody');

            var business_len = yelp_data['businesses']['length'];
            // columns ['No.','Image','Business Name','Rating','Distance(miles)']
            document.getElementById('image').innerHTML = 'Image';
            document.getElementById('no').innerHTML = 'NO.';
            document.getElementById('business_name').innerHTML = 'Business Name';
            document.getElementById('rating').innerHTML = 'Rating';
            document.getElementById('distance_table').innerHTML = 'Distance(miles)';
            document.getElementById('table_div').scrollIntoView();

            //for every row in table
            for (var i = 0; i < business_len; i++) {
                //create a new row
                var row = document.createElement('tr');
                //create a No. cell 
                var no_cell = document.createElement('td');
                no_cell.innerHTML = i + 1;
                row.appendChild(no_cell);
                //create image cell

                var img_cell = document.createElement('td');
                img_url = yelp_data['businesses'][i]['image_url'];
                img_cell.innerHTML = "<img src=" + img_url + " width=100, height=100>";
                row.appendChild(img_cell);

                //create business name cell and ordering
                var bn_cell = document.createElement('td');
                bn = yelp_data['businesses'][i]['name'];
                b_id = yelp_data['businesses'][i]['id'];

                //skip to the thrid section
                skip_info = '#info';
                //bn_cell.innerHTML = '<a href=' + skip_info + ' onclick = "b_data(\'' + bn + '\',\'' + catego + '\',\'' + address_full + '\',\'' + phone + '\',\'' + price_ + '\',\'' + transactions + '\',\'' + more_info + '\',\'' + is_close + '\')" >' + bn + '</a>';
                bn_cell.innerHTML = '<p' + ' onclick = "get_detail_data(\'' + b_id + '\')" >' + bn + '</p>';
                //bn_cell.innerHTML = '<p' + 'onclick = "get_detail_data(\'' + b_id + '\')" >' + bn + '</p>';

                //console.log(bn_cell.innerHTML)

                row.appendChild(bn_cell);

                //create rating cell and ordering
                var r_cell = document.createElement('td');
                r = yelp_data['businesses'][i]['rating'];
                r_cell.innerHTML = r;
                row.appendChild(r_cell);

                //create distance and ordering
                var d_cell = document.createElement('td');
                d = yelp_data['businesses'][i]['distance'] / 1609.344;

                d_cell.innerHTML = d.toFixed(2);
                row.appendChild(d_cell);
                //append new row for once/loop
                data_table.appendChild(row);


            }



        }

    } catch (e) {
        console.log('ERROR', e);
    }
};
testfuc();



//sort table functions
function sortTable(table, col, reverse) {
    var tb = table.tBodies[0],
        tr = Array.prototype.slice.call(tb.rows, 0),
        i;
    reverse = -((+reverse) || -1);
    tr = tr.sort(function (a, b) {
        return reverse
            * (a.cells[col].textContent.trim()
                .localeCompare(b.cells[col].textContent.trim())
            );
    });
    for (i = 0; i < tr.length; ++i) {
        tr[i].cells[0].innerHTML = i + 1;
        tb.appendChild(tr[i]);
    }
}

function makeSortable(table) {
    var th = table.tHead, i;
    th && (th = th.rows[0]) && (th = th.cells);
    if (th) i = th.length;
    else return;
    while (--i >= 0) (function (i) {
        var dir = 1;
        if (th[i] != document.getElementById("image") && th[i] != document.getElementById("no")) {
            th[i].addEventListener('click', function () { sortTable(table, i, (dir = 1 - dir)) });
        }

    }(i));
}

function makeAllSortable(parent) {
    parent = parent || document.body;
    var t = parent.getElementsByTagName('table'), i = t.length;
    while (--i >= 0) makeSortable(t[i]);
}
makeAllSortable();

