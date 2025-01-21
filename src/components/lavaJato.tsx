import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../styles/tabelalavajato.css";
import moment from 'moment-timezone'

interface LavaJato {
  nome: string;
  veiculo: string;
  cor: string;
  placa: string;
  data: string;
  hora: string;
  valor: string;
  formaPagamento: string;
}

const formatarData = (dataISO: string) => { 
  const data = moment.tz(dataISO, "America/Sao_Paulo");
  return data.isValid() ? data.format("DD/MM/YYYY") : "Data Inválida";
};

const formatarValor = (valor: string | number) => {
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const LavaJato: React.FC = () => {
  const [lavaJatoData, setLavaJatoData] = useState<LavaJato[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("nome");
  const [filtroBusca, setFiltroBusca] = useState<string>("");
  const [pdfDataInicio, setPdfDataInicio] = useState<string>("");
  const [pdfDataFim, setPdfDataFim] = useState<string>("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('lavajato');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          parsedData.sort((a: LavaJato, b: LavaJato) => {
            return moment(b.data).isBefore(moment(a.data)) ? 1 : -1;
          });
          setLavaJatoData(parsedData);
        } else {
          setLavaJatoData([parsedData]);
        }
      } catch (error) {
        console.error('Erro ao parsear os dados do localStorage:', error);
      }
    } else {
      console.log('Nenhum dado encontrado no localStorage');
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  const filteredLavaJato = () => {
      const storedData = localStorage.getItem('lavajato');
      if (!storedData) {
        console.error('Nenhum dado encontrado no localStorage');
        return [];
      }
    
      const lavaJatoData: LavaJato[] = JSON.parse(storedData);
    
      return lavaJatoData.filter(lavajato => {
        const lavaJatoData = moment(lavajato.data, "YYYY-MM-DD");
    
        const dataInicioValida = dataInicio ? moment(dataInicio, "YYYY-MM-DD", true).isValid() : true;
        const dataFimValida = dataFim ? moment(dataFim, "YYYY-MM-DD", true).isValid() : true;
    
        const dataInicioFormatada = dataInicio && dataInicioValida ? moment(dataInicio).startOf('day') : null;
        const dataFimFormatada = dataFim && dataFimValida ? moment(dataFim).endOf('day') : null;
    
        const dataValida =
          (!dataInicioFormatada || lavaJatoData.isSameOrAfter(dataInicioFormatada)) &&
          (!dataFimFormatada || lavaJatoData.isSameOrBefore(dataFimFormatada));
    
        const textoBusca =
          filtroTipo === "nome"
            ? lavajato.nome.toLowerCase().includes(filtroBusca.toLowerCase())
            : lavajato.veiculo.toLowerCase().includes(filtroBusca.toLowerCase());
    
        return dataValida && textoBusca;
      });
    };

  const itemsPerPage = 10;
  const displayedLavaJato = filteredLavaJato()
  .sort((a: LavaJato, b: LavaJato) => {
      return moment(b.data).isBefore(moment(a.data)) ? 1 : -1;
  })
  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const gerarNotaFiscal = (lavajato: LavaJato) => {
    const doc = new jsPDF();
  
    doc.text("Nota Fiscal - LS Parking - Lava Jato", 14, 10);
    doc.setFontSize(10);
    doc.text("Emitido por: LS Parking - CNPJ: 56.166.894/0001-49", 14, 16);
  
    doc.autoTable({
      startY: 25,
      head: [['Campo', 'Informação']],
      body: [
        ['Nome', lavajato.nome],
        ['Veículo', lavajato.veiculo],
        ['Cor', lavajato.cor],
        ['Placa', lavajato.placa],
        ['Data', formatarData(lavajato.data)],
        ['Hora', lavajato.hora],
        ['Valor', formatarValor(lavajato.valor)],
        ['Forma de Pagamento', lavajato.formaPagamento],
      ],
    });
  
    doc.text(
      "Observação: Este documento é válido como comprovante de pagamento.",
      14,
      doc.lastAutoTable.finalY + 10
    );
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");
  };

  const gerarPDF = async () => {
    const storedData = localStorage.getItem('lavajato');
    if (!storedData) {
      console.error('Nenhum dado encontrado no localStorage');
      return;
    }
  
    let lavaJatoData: LavaJato[] = [];
  
    try {
      const parsedData = JSON.parse(storedData);
      if (Array.isArray(parsedData)) {
        lavaJatoData = parsedData;
      } else {
        lavaJatoData = [parsedData];
      }
    } catch (error) {
        console.error('Erro ao parsear os dados do localStorage:', error);
        return;
    }
  
      const doc = new jsPDF();
      let totalValor = 0;
      let totalDinheiro = 0;
      let totalPix = 0;
  
      doc.text("Relatório de Diaristas e Pernoites", 14, 10);
      doc.autoTable({
        startY: 20,
        head: [['Nome', 'Veículo', 'Cor', 'Placa', 'Data', 'Hora', 'Valor', 'Forma de Pagamento']],
        body: lavaJatoData.map((lavajato: LavaJato) => {
          const valor = parseFloat(lavajato.valor.replace('R$', '').replace(',', '.'));
          totalValor += valor;

          if (lavajato.formaPagamento.toLowerCase() === 'dinheiro') {
            totalDinheiro += valor;
          } else if (lavajato.formaPagamento.toLowerCase() === 'pix') {
            totalPix += valor;
          }

          return [
            lavajato.nome,
            lavajato.veiculo,
            lavajato.cor,
            lavajato.placa,
            formatarData(lavajato.data),
            lavajato.hora,
            formatarValor(lavajato.valor),
            lavajato.formaPagamento,
          ];
        }),
      });
  
      doc.setFontSize(12);

      const totalY = doc.lastAutoTable.finalY + 10;

      doc.text(`Total em Dinheiro: R$ ${totalDinheiro.toFixed(2).replace('.', ',')}`, 14, totalY);
      doc.text(`Total em PIX: R$ ${totalPix.toFixed(2).replace('.', ',')}`, 14, totalY + 5);
      doc.text(`Valor Total: R$ ${totalValor.toFixed(2).replace('.', ',')}`, 14, totalY + 10);

      doc.save("relatorio_lavajato.pdf");
      setIsPdfModalOpen(false);
  };

  return (
    <section id="mainContent" className="main-content" style={{ width: '100%' }}>
      <div className="m-4" style={{ height: '100vh' }}>
        <h1>Lava Jato</h1>
        <div className="search-container">
          <button className="btn btn-secondary my-2 mx-2" onClick={openModal}>
            Filtrar
          </button>
          <button className="btn btn-primary my-2 mx-2" onClick={() => setIsPdfModalOpen(true)}>
            Gerar PDF
          </button>
        </div>

        {isPdfModalOpen && (
          <div className="modal-overlay" onClick={() => setIsPdfModalOpen(false)}></div>
        )}

        {isPdfModalOpen && (
          <div className="modal fade show" style={{ display: "block", zIndex: 1051 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Gerar PDF - Filtro de Datas</h5>
                  <button type="button" className="btn-close" onClick={() => setIsPdfModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="pdfDataInicio" className="form-label">Data Início</label>
                    <input
                      type="date"
                      id="pdfDataInicio"
                      className="form-control"
                      value={pdfDataInicio}
                      onChange={(e) => setPdfDataInicio(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="pdfDataFim" className="form-label">Data Fim</label>
                    <input
                      type="date"
                      id="pdfDataFim"
                      className="form-control"
                      value={pdfDataFim}
                      onChange={(e) => setPdfDataFim(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={gerarPDF}>
                    Gerar PDF
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsPdfModalOpen(false)}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}></div>
        )}

        {isModalOpen && (
          <div className="modal fade show" style={{ display: 'block', zIndex: 1051 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Filtrar Cliente</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="dataInicio" className="form-label">Data Início</label>
                    <input type="date" className="form-control" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dataFim" className="form-label">Data Fim</label>
                    <input type="date" className="form-control" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filtroTipo" className="form-label">Buscar por</label>
                    <select className="form-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                      <option value="nome">Nome</option>
                      <option value="veiculo">Veículo</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="filtroBusca" className="form-label">Buscar</label>
                    <input type="text" className="form-control" value={filtroBusca} onChange={(e) => setFiltroBusca(e.target.value)} placeholder="Pesquisar..." />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={closeModal}>Aplicar Filtros</button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Fechar</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='table-responsive my-2'>
        <table className="table table-striped table-bordered table-hover table-sm" id="lavaJatoTable">
          <thead className="thead-dark">
            <tr className="text-center">
              <th>Nome</th>
              <th>Veículo</th>
              <th>Cor</th>
              <th>Placa</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Valor</th>
              <th>Forma de Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayedLavaJato.map((lavajato, index) => (
              <tr key={index} className="text-center">
                <td>{lavajato.nome}</td>
                <td>{lavajato.veiculo}</td>
                <td>{lavajato.cor}</td>
                <td>{lavajato.placa}</td>
                <td>{formatarData(lavajato.data)}</td>
                <td>{lavajato.hora}</td>
                <td>{formatarValor(lavajato.valor)}</td>
                <td>{lavajato.formaPagamento}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => gerarNotaFiscal(lavajato)}
                  >
                    <i className="bi bi-receipt text-white"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Paginação */}
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Próxima'}
          breakLabel={'...'}
          pageCount={Math.ceil(filteredLavaJato().length / itemsPerPage)}
          onPageChange={handlePageChange}
          containerClassName={'pagination justify-content-center'}
          activeClassName={"active"}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link no-focus'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link no-focus'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link no-focus'}
          forcePage={currentPage}
        />
      </div>

      <footer className="footerContainer py-4" style={{ backgroundColor: "#f5f5f5" }}>
        <div className="container">
          <p className="text-center m-0">LS Parking - 2025 Todos os direitos reservados</p>
        </div>
      </footer>

      <style>
        {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1049;
          }
        `}
      </style>
    </section>
  );
};

export default LavaJato;
