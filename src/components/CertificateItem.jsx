import '../css/main.css';
import '../css/styles.css';
import '../css/form.css';

function CertificateItem({item}){

    return (
        <div>
<h1>TASK</h1>
<div class="certificate">
              <div class="certificate-image">
			  </div>
              <div class="certificate-description">
                <div class="certificate-title">
                  <div class="certificate-title-text">Coupon name</div>
                  <a href="favorites.html">
                   </a>
                </div>
                <div class="certificate-brief">
                  <div class="certificate-brief-text">Some brief description</div>
                  <span class="certificate-brief-expires">Expires in 3 days</span>
                </div>
                <div class="certificate-details">
                  <div class="certificate-details-price">$235</div>
                  <button class="certificate-details-button">Add to Cart</button>
                </div>
              </div>
            </div>
        </div>
    );

};

export default CertificateItem;