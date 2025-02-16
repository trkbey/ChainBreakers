import { useState } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState("");
  const [signer, setSigner] = useState("");

  const contractAddress = "0x3904803495834095834095"; //KONTRATIMIZIN ADRESİ
  const contractAbi = [[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_freelancer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_employer",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "approveAndPay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancelJob",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "employer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "forceReleasePayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "freelancer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "markWorkCompleted",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paymentAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paymentReleased",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "workCompleted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]]; // KONTRATIMIZIN ABI'ı


  // CÜZDAN BAĞLAMA FONKSİYONU
  const connectWallet = async () => {

    // Browserda provider var mı yok mu kontrol ediyoruz
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }

    try {

      // providerımız için Blockchain ile bağlantıyı gerçekleştirecek bir nesne oluşturuyoruz
      const provider = new ethers.BrowserProvider(window.ethereum);

      // provider nesnemizden getSigner() ile kontratı imzalayacak hesabı seçiyoruz
      const signer = await provider.getSigner();

      // eğer yardımcı olursa imzalayacak hesabın adresini getAddress() ile seçebilirsiniz
      const address = await signer.getAddress();

      // front-end state olarak belirliyoruz uygulamamızda kullanmak için
      setUserAddress(address);
      setSigner(signer);

      console.log("Wallet connected:", address);

    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };


  // Kontratınızda bulunan bir fonksiyon
  const getStakingDetails = async () => {

    // Kontrat ile etkileşime gelecek bir nesne oluşturuyoruz hemen hemen her nesne aynıdır
    let contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    try {
      console.log("User Address:", userAddress);

      // oluşturduğumuz nesne üzerinden kontratımızdaki 
      // bir fonksiyonu istediği parametreler ile çağırıyoruz
      const details = await contract.getStakingDetails(userAddress);
      console.log("Raw Details:", details);

    } catch (error) {
      console.error("Error fetching staking details:", error);
    }
  };

  // Kontratınızda bulunan bir fonksiyon
  const createStake = async () => {

    // Kontrat ile etkileşime gelecek bir nesne oluşturuyoruz hemen hemen her nesne aynıdır
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    try {

      // kontratımızda bulunan bir transaction fonksiyonunu çağırıyoruz çağırıyoruz
      // ve içine fonksiyonumuzun istediği parametreleri yerleştiriyoruz
      const tx = await contract.stake(
        100000000000,
        4263546872354
      );

      console.log("Transaction Sent:", tx);
      // transactionun blockchain tarafından onaylanmasını bekliyoruz biraz uzun sürebilir
      await tx.wait();
      console.log("Transaction Mined:", tx);

    } catch (error) {
      console.error("Error creating stake:", error.reason || error.message);
    }
  };

  const raiseStaking = async () => {

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    try {
      const tx = await contract.raiseStaking(
        100000005555,
        3453467234234
      );

      console.log("Transaction Sent:", tx);
      await tx.wait();
      console.log("Transaction Mined:", tx);

    } catch (error) {
      console.error("Error raising staking:", error.reason || error.message);
    }
  };

  const truncateString = (str, length = 200) => {
    return str.length > length ? str.slice(0, length) + "..." : str;
  };

  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <section >
      <div className="container pt-4">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col">
                <h1>Chain<span style={{ fontWeight: "400" }}>lancer</span></h1>
                <button className="btn btn-dark" onClick={connectWallet}>Cüzdan Bağla</button>
                {userAddress && <p>Cüzdan Adresi: {userAddress}</p>}
                
              </div>
              <div className="col d-flex justify-content-end">
                <button className="btn btn-dark" onClick={() => navigate("/post-job")}>İş İlanı Ver</button>
              </div>
            </div>
          </div>
          <div className="col-12 pt-3">
            <nav>
              <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">İş İlanı</button>
                <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Oylamalar</button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active px-3 py-2" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                <div className="row">
                  <div className="col-12">
                    <div className="ilan">
                      <div className="row">
                        <div className="col-9">
                          <div className="row">
                            <div className="col-12">
                              <h6>Domain & Hosting Migration to Free Service <span className="ms-4" style={{ fontWeight: "400" }}>6 days left</span></h6>
                            </div>
                            <div className="col-12">
                              <p style={{ fontWeight: "300", fontSize: "16px" }}>
                                {truncateString("I need assistance in migrating my current hosting and domain to a free hosting provider. All traffic, including sub-domain traffic, should be directed to the main domain, which will display a maintenance page. Ideal skills for this project include: - Proficiency in domain and hosting management - Experience with setting up maintenance pages - Knowledge of free hosting services Please note, email addresses currently managed by the domain do not need to be transferred. More details will be provided upon confirmation.")}
                              </p>
                            </div>
                            <div className="col-12 d-flex gap-3">
                              <a href="">Domain Research</a>
                              <a href="">Web Development</a>
                              <a href="">Web Hosting</a>
                            </div>
                          </div>
                        </div>

                        <div className="col-3">
                          <div className="row">
                            <div className="col-12 mb-2">
                              <span className="me-1" style={{ fontWeight: "700" }}>16€</span>
                              Average
                            </div>
                            <div className="col-12 mb-2">
                              11 Offer
                            </div>
                            <div className="col-12">
                              <button className="btn btn-dark">Şimdi Teklif Ver</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="ilan">
                      <div className="row">
                        <div className="col-9">
                          <div className="row">
                            <div className="col-12">
                              <h6>Development of a Blockchain-Based Web Wallet Demo for Enterprise Use
                                <span className="ms-4" style={{ fontWeight: "400" }}>8 days left</span></h6>
                            </div>
                            <div className="col-12">
                              <p style={{ fontWeight: "300", fontSize: "16px" }}>
                                {truncateString("We are looking for an experienced blockchain developer to create a Web Wallet demo designed for enterprise use, with the potential for future scalability .")}
                              </p>
                            </div>
                            <div className="col-12 d-flex gap-3">
                              <a href="">Soldıty Expert</a>
                              <a href="">Web3</a>
                              <a href="">Remix ide</a>
                            </div>
                          </div>
                        </div>

                        <div className="col-3">
                          <div className="row">
                            <div className="col-12 mb-2">
                              <span className="me-1" style={{ fontWeight: "700" }}>26€</span>
                              Average
                            </div>
                            <div className="col-12 mb-2">
                              35 Offer
                            </div>
                            <div className="col-12">
                              <button className="btn btn-dark">Şimdi Teklif Ver</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">

                  </div>
                  <div className="col-12">

                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                <div className="row">
                  <div className="col-12">
                    <div class="accordion" id="">
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <h6>Android Gaming App Development
                            </h6>
                          </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show">
                          <div class="accordion-body">
                            <div className="row">
                              <div className="col-6"><h5> İşveren</h5></div>
                              <div className="col-6"><h5> İşçi</h5></div>
                              <div className="col-6">
                                Freelancer istenilen renk paletine uygun ara yüzü tasarlayamamış
                              </div>
                              <div className="col-6">
                                İş ilanı kısmında renk paletleri konusunda yeterli açıklama yapılmamış
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşveren Haklı</button>
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşçi Haklı</button>
                              </div>
                            </div>                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            <h6>Chrome Extension Enhancement for Paywalled Content

                            </h6>
                          </button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse">
                          <div class="accordion-body">
                            <div className="row">
                              <div className="col-6"><h5> İşveren</h5></div>
                              <div className="col-6"><h5> İşçi</h5></div>
                              <div className="col-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet aspernatur quidem iste cum quas neque ipsa, sit provident fuga recusandae obcaecati ab totam rem beatae. Ut cumque hic quod.
                              </div>
                              <div className="col-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet aspernatur quidem iste cum quas neque ipsa, sit provident fuga recusandae obcaecati ab totam rem beatae. Ut cumque hic quod.
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşveren Haklı</button>
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşçi Haklı</button>
                              </div>
                            </div>                          </div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                            <h6>Development of a Blockchain-Based Web Wallet Demo for Enterprise Use
                            </h6>
                          </button>
                        </h2>
                        <div id="collapseThree" class="accordion-collapse collapse">
                          <div class="accordion-body">
                            <div className="row">
                              <div className="col-6"><h5> İşveren</h5></div>
                              <div className="col-6"><h5> İşçi</h5></div>
                              <div className="col-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet aspernatur quidem iste cum quas neque ipsa, sit provident fuga recusandae obcaecati ab totam rem beatae. Ut cumque hic quod.
                              </div>
                              <div className="col-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet aspernatur quidem iste cum quas neque ipsa, sit provident fuga recusandae obcaecati ab totam rem beatae. Ut cumque hic quod.
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşveren Haklı</button>
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşçi Haklı</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="accordion" id="accordionExample">
                      <div className="accordion-item oy mb-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            
                          </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div clasclassName="accordion-body">
                            
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item oy mb-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <h6>Development of a Blockchain-Based Web Wallet Demo for Enterprise Use
                            </h6>
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-6"><h5> İşveren</h5></div>
                              <div className="col-6"><h5> İşçi</h5></div>
                              <div className="col-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet aspernatur quidem iste cum quas neque ipsa, sit provident fuga recusandae obcaecati ab totam rem beatae. Ut cumque hic quod.
                              </div>
                              <div className="col-6">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus amet aspernatur quidem iste cum quas neque ipsa, sit provident fuga recusandae obcaecati ab totam rem beatae. Ut cumque hic quod.
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşveren Haklı</button>
                              </div>
                              <div className="col-6 text-center">
                                <button className="btn btn-dark mt-3">İşçi Haklı</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function PostJob() {
  return (
    <div className="container">
      <h2>İş İlanı Ver</h2>
      <p>

      </p>
      <Link to="/">Ana Sayfaya Dön</Link>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
    </Router>
  );
}

export default App;
