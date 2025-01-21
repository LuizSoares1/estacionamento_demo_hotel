import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/registerVehicle.css';

const RegisterVehicle: React.FC = () => {
  const [activeTab, setActiveTab] = useState("diarista");
  const [cpf, setCpf] = useState("");
  const [valor, setValor] = useState("");
  const [placa, setPlaca] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [nome, setNome] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [cor, setCor] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const options = { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' };
    const dateParts = now.toLocaleDateString('pt-BR', options).split('/');
    const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

    const finalDateObj = new Date(now);
    finalDateObj.setMonth(finalDateObj.getMonth() + 1); // Soma 1 mês
    const finalDateParts = finalDateObj.toLocaleDateString('pt-BR', options).split('/');
    const finalDateString = `${finalDateParts[2]}-${finalDateParts[1]}-${finalDateParts[0]}`;

    setCurrentDate(date);
    setCurrentTime(time);
    setFinalDate(finalDateString);
}, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleDiarista = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const data = {
      nome,
      veiculo,
      cor,
      placa,
      data: currentDate,
      hora: currentTime,
      valor: valor.replace("R$", "").replace(",", ".").trim(),
      formaPagamento,
    };
  
    const storedData = localStorage.getItem('diaristas');
    
    let diaristasExistentes = storedData ? JSON.parse(storedData) : [];
  
    if (!Array.isArray(diaristasExistentes)) {
      console.error("Os dados recuperados não são um array válido");
      diaristasExistentes = [];
    }

    diaristasExistentes.push(data);
  
    localStorage.setItem('diaristas', JSON.stringify(diaristasExistentes));
  
    alert("Diarista registrado no localStorage com sucesso!");
  };
  
  const handleMensalista = async (e) => {
    e.preventDefault();
    const data = {
      nomeCompleto,
      cpf,
      dataNascimento,
      veiculo,
      cor,
      placa,
      dataInicio: currentDate,
      dataFim: finalDate,
      valor: valor.replace("R$", "").replace(",", ".").trim(),
      formaPagamento,
    };
  
    const storedData = localStorage.getItem('mensalistas');
    
    let mensalistasExistentes = storedData ? JSON.parse(storedData) : [];
  
    if (!Array.isArray(mensalistasExistentes)) {
      console.error("Os dados recuperados não são um array válido");
      mensalistasExistentes = [];
    }

    mensalistasExistentes.push(data);
  
    localStorage.setItem('mensalistas', JSON.stringify(mensalistasExistentes));
  
    alert("Mensalista registrado no localStorage com sucesso!");
  };

  const handleLavaJato = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      nome,
      veiculo,
      cor,
      placa,
      data: currentDate,
      hora: currentTime,
      valor: valor.replace("R$", "").replace(",", ".").trim(),
      formaPagamento,
    }   

    const storedData = localStorage.getItem('lavajato');
    
    let clientesExistentes = storedData ? JSON.parse(storedData) : [];
  
    if (!Array.isArray(clientesExistentes)) {
      console.error("Os dados recuperados não são um array válido");
      clientesExistentes = [];
    }

    clientesExistentes.push(data);
  
    localStorage.setItem('lavajato', JSON.stringify(clientesExistentes));
  
    alert("Mensalista registrado no localStorage com sucesso!");
  }
  
  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    let cleanedValue = value.replace(/[^A-Z0-9]/g, '');
    
    if (cleanedValue.length > 3) {
      cleanedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 7)}`;
    }
    
    if (cleanedValue.length > 8) {
      cleanedValue = cleanedValue.slice(0, 8);
    }

    setPlaca(cleanedValue);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    setCpf(value);
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d,]/g, "");
  
    setValor(value ? `R$ ${value}` : "");
  };
  

  return (
    <section id="mainContent" className="main-content" style={{ width: "100%" }}>
      <div className="m-4 registerContainerDiv">
        <h1 className="my-4">Registrar</h1>
        <ul className="nav nav-tabs" id="vehicleTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === "diarista" ? "active" : ""}`}
              id="diarista-tab"
              role="tab"
              onClick={() => handleTabClick("diarista")}
              style={{ 
                cursor: "pointer", 
                backgroundColor: activeTab === "diarista" ? "#007bff" : "#f0f0f0",
                color: activeTab === "diarista" ? "#fff" : "#6c757d"
              }}
            >
              Diaristas/Pernoite
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === "mensalista" ? "active" : ""}`}
              id="mensalista-tab"
              role="tab"
              onClick={() => handleTabClick("mensalista")}
              style={{ 
                cursor: "pointer", 
                backgroundColor: activeTab === "mensalista" ? "#007bff" : "#f0f0f0",
                color: activeTab === "mensalista" ? "#fff" : "#6c757d"
              }}
            >
              Mensalistas
            </a>
          </li>
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${activeTab === "lavaJato" ? "active" : ""}`}
              id="lavaJato-tab"
              role="tab"
              onClick={() => handleTabClick("lavaJato")}
              style={{ 
                cursor: "pointer", 
                backgroundColor: activeTab === "lavaJato" ? "#007bff" : "#f0f0f0",
                color: activeTab === "lavaJato" ? "#fff" : "#6c757d"
              }}
            >
              Lava Jato
            </a>
          </li>
        </ul>
        <div className="tab-content mt-3" id="vehicleTabsContent">
          {activeTab === "diarista" && (
            <div className="tab-pane fade show active tabChildContent" id="diarista" role="tabpanel" aria-labelledby="diarista-tab">
              <form onSubmit={handleDiarista}>
                <div className="mb-3">
                  <label htmlFor="diaristaNome" className="form-label">Nome:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="diaristaNome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="veiculoPropss">
                  <div className="mb-3 veiculoContainerDiv">
                    <label htmlFor="diaristaVeiculo" className="form-label">Veículo:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diaristaVeiculo"
                      value={veiculo}
                      onChange={(e) => setVeiculo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 corContainerDiv">
                    <label htmlFor="diaristaCor" className="form-label">Cor:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diaristaCor"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 placaContainerDiv">
                    <label htmlFor="diaristaPlaca" className="form-label">Placa:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diaristaPlaca"
                      value={placa}
                      onChange={handlePlacaChange}
                      maxLength={8}
                      required
                    />
                  </div>
                </div>
                <div className="dataHoraDiv">
                  <div className="mb-3 dataContainer">
                    <label htmlFor="dateInput" className="form-label">Data:</label>
                    <input type="date" className="form-control" id="dateInput" value={currentDate} readOnly />
                  </div>
                  <div className="mb-3 horaContainer">
                    <label htmlFor="timeInput" className="form-label">Hora:</label>
                    <input type="time" className="form-control" id="timeInput" value={currentTime} readOnly />
                  </div>
                </div>
                <div className="pagamentoContainerDiv">
                  <div className="mb-3 valorContainerDiv">
                    <label htmlFor="valorInput" className="form-label">Valor:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="valorInput"
                      value={valor}
                      onChange={handleValorChange}
                      required
                    />
                  </div>
                  <div className="mb-3 payFormContainerDiv">
                    <label htmlFor="paymentMethod" className="form-label">Forma de Pagamento:</label>
                    <select className="form-select" id="paymentMethod" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} required>
                      <option value="" disabled hidden>Selecionar:</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </div>
                </div>
                <div className="buttonRegisterContainer">
                  <button type="submit" className="btn btn-primary">Registrar Diarista/Pernoite</button>
                </div>
                
              </form>
            </div>
          )}
          {activeTab === "mensalista" && (
            <div className="tab-pane fade show active tabChildContent" id="mensalista" role="tabpanel" aria-labelledby="mensalista-tab">
              <form onSubmit={handleMensalista}>
                <div className="mb-3">
                  <label htmlFor="mensalistaNome" className="form-label">Nome Completo:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="mensalistaNome"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    required
                  />
                </div>
                <div className="personInfoContainer">
                  <div className="mb-3 cpfContainerDiv">
                    <label htmlFor="cpfInput" className="form-label">CPF:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cpfInput"
                      value={cpf}
                      onChange={handleCpfChange}
                      maxLength={14}
                      required
                    />
                  </div>
                  <div className="mb-3 nascimentoContainerDiv">
                    <label htmlFor="dateBirthInput" className="form-label">Data de Nascimento:</label>
                    <input type="date" className="form-control" id="dateBirthInput" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required/>
                  </div>
                </div>
                <div className="veiculoPropss">
                  <div className="mb-3 veiculoContainerDiv">
                    <label htmlFor="mensalistaVeiculo" className="form-label">Veículo:</label>
                    <input type="text" className="form-control" id="mensalistaVeiculo" value={veiculo} onChange={(e) => setVeiculo(e.target.value)} required/>
                  </div>
                  <div className="mb-3 corContainerDiv">
                    <label htmlFor="mensalistaCor" className="form-label">Cor:</label>
                    <input type="text" className="form-control" id="mensalistaCor" value={cor} onChange={(e) => setCor(e.target.value)} required/>
                  </div>
                  <div className="mb-3 placaContainerDiv">
                    <label htmlFor="mensalistaPlaca" className="form-label">Placa:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="mensalistaPlaca"
                      value={placa}
                      onChange={handlePlacaChange}
                      maxLength={8}
                      required
                    />
                  </div>
                </div>
                <div className="dataMensalistaContainer">
                  <div className="mb-3 dataInicioDiv">
                    <label htmlFor="dateStartInput" className="form-label">Data Início:</label>
                    <input type="date" className="form-control" id="dateStartInput" value={currentDate} readOnly/>
                  </div>
                  <div className="mb-3 dataEndDiv">
                    <label htmlFor="dateEndInput" className="form-label">Data Fim:</label>
                    <input type="date" className="form-control" id="dateEndInput" value={finalDate} readOnly/>
                  </div>
                </div>
                <div className="pagamentoContainerDiv">
                  <div className="mb-3 valorContainerDiv">
                    <label htmlFor="valorInput" className="form-label">Valor:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="valorInput"
                      value={valor}
                      onChange={handleValorChange}
                      required
                    />
                  </div>
                  <div className="mb-3 payFormContainerDiv">
                    <label htmlFor="paymentMethod" className="form-label">Forma de Pagamento:</label>
                    <select className="form-select" id="paymentMethod" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} required>
                      <option value="" disabled hidden>Selecionar:</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </div>
                </div>
                
                <div className="buttonRegisterContainer">
                  <button type="submit" className="btn btn-primary">Registrar Mensalista</button>
                </div>
              </form>
            </div>
          )}
          {activeTab === "lavaJato" && (
            <div className="tab-pane fade show active tabChildContent" id="lavaJato" role="tabpanel" aria-labelledby="diarista-tab">
              <form onSubmit={handleLavaJato}>
                <div className="mb-3">
                  <label htmlFor="lavaJatoNome" className="form-label">Nome:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lavaJatoNome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="veiculoPropss">
                  <div className="mb-3 veiculoContainerDiv">
                    <label htmlFor="lavaJatoVeiculo" className="form-label">Veículo:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diaristaVeiculo"
                      value={veiculo}
                      onChange={(e) => setVeiculo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 corContainerDiv">
                    <label htmlFor="diaristaCor" className="form-label">Cor:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diaristaCor"
                      value={cor}
                      onChange={(e) => setCor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 placaContainerDiv">
                    <label htmlFor="diaristaPlaca" className="form-label">Placa:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="diaristaPlaca"
                      value={placa}
                      onChange={handlePlacaChange}
                      maxLength={8}
                      required
                    />
                  </div>
                </div>
                <div className="dataHoraDiv">
                  <div className="mb-3 dataContainer">
                    <label htmlFor="dateInput" className="form-label">Data:</label>
                    <input type="date" className="form-control" id="dateInput" value={currentDate} readOnly />
                  </div>
                  <div className="mb-3 horaContainer">
                    <label htmlFor="timeInput" className="form-label">Hora:</label>
                    <input type="time" className="form-control" id="timeInput" value={currentTime} readOnly />
                  </div>
                </div>
                <div className="pagamentoContainerDiv">
                  <div className="mb-3 valorContainerDiv">
                    <label htmlFor="valorInput" className="form-label">Valor:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="valorInput"
                      value={valor}
                      onChange={handleValorChange}
                      required
                    />
                  </div>
                  <div className="mb-3 payFormContainerDiv">
                    <label htmlFor="paymentMethod" className="form-label">Forma de Pagamento:</label>
                    <select className="form-select" id="paymentMethod" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} required>
                      <option value="" disabled hidden>Selecionar:</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="PIX">PIX</option>
                    </select>
                  </div>
                </div>
                <div className="buttonRegisterContainer">
                  <button type="submit" className="btn btn-primary">Registrar Cliente</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <footer className="footerContainer py-4" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className="text-center p-0 m-0">LS Parking - 2025 Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default RegisterVehicle;
