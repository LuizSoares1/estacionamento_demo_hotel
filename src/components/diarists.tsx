import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../styles/tabela.css";
import moment from 'moment-timezone';

interface Diarista {
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

const Diaristas: React.FC = () => {
  const [diaristasData, setDiaristasData] = useState<Diarista[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('nome');
  const [filtroBusca, setFiltroBusca] = useState<string>('');
  const [pdfDataInicio, setPdfDataInicio] = useState<string>('');
  const [pdfDataFim, setPdfDataFim] = useState<string>('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('diaristas');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          parsedData.sort((a: Diarista, b: Diarista) => {
            return moment(b.data).isBefore(moment(a.data)) ? 1 : -1;
          });
          setDiaristasData(parsedData);
        } else {
          setDiaristasData([parsedData]);
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

  const filteredDiaristas = () => {
    const storedData = localStorage.getItem('diaristas');
    if (!storedData) {
      console.error('Nenhum dado encontrado no localStorage');
      return [];
    }
  
    const diaristasData: Diarista[] = JSON.parse(storedData);
  
    return diaristasData.filter(diarista => {
      const diaristaData = moment(diarista.data, "YYYY-MM-DD");
  
      const dataInicioValida = dataInicio ? moment(dataInicio, "YYYY-MM-DD", true).isValid() : true;
      const dataFimValida = dataFim ? moment(dataFim, "YYYY-MM-DD", true).isValid() : true;
  
      const dataInicioFormatada = dataInicio && dataInicioValida ? moment(dataInicio).startOf('day') : null;
      const dataFimFormatada = dataFim && dataFimValida ? moment(dataFim).endOf('day') : null;
  
      const dataValida =
        (!dataInicioFormatada || diaristaData.isSameOrAfter(dataInicioFormatada)) &&
        (!dataFimFormatada || diaristaData.isSameOrBefore(dataFimFormatada));
  
      const textoBusca =
        filtroTipo === "nome"
          ? diarista.nome.toLowerCase().includes(filtroBusca.toLowerCase())
          : diarista.veiculo.toLowerCase().includes(filtroBusca.toLowerCase());
  
      return dataValida && textoBusca;
    });
  };
  

  const itemsPerPage = 10;
  const displayedDiaristas = filteredDiaristas()
  .sort((a: Diarista, b: Diarista) => {
    return moment(b.data).isBefore(moment(a.data)) ? 1 : -1;
  })
  .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const gerarNotaFiscal = (diarista: Diarista) => {
    const doc = new jsPDF();
  
    doc.text("Nota Fiscal - LS Parking - Diária/Pernoite", 14, 10);
    doc.setFontSize(10);
    doc.text("Emitido por: LS Parking - CNPJ: 56.166.894/0001-49", 14, 16);
  
    doc.autoTable({
      startY: 25,
      head: [['Campo', 'Informação']],
      body: [
        ['Nome', diarista.nome],
        ['Veículo', diarista.veiculo],
        ['Cor', diarista.cor],
        ['Placa', diarista.placa],
        ['Data', formatarData(diarista.data)],
        ['Hora', diarista.hora],
        ['Valor', formatarValor(diarista.valor)],
        ['Forma de Pagamento', diarista.formaPagamento],
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
    const storedData = localStorage.getItem('diaristas');
    if (!storedData) {
      console.error('Nenhum dado encontrado no localStorage');
      return;
    }
  
    let diaristasData: Diarista[] = [];
  
    try {
      const parsedData = JSON.parse(storedData);
      if (Array.isArray(parsedData)) {
        diaristasData = parsedData;
      } else {
        diaristasData = [parsedData];
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
      body: diaristasData.map((diarista: Diarista) => {
        const valor = parseFloat(diarista.valor.replace('R$', '').replace(',', '.'));
        totalValor += valor;
  
        if (diarista.formaPagamento.toLowerCase() === 'dinheiro') {
          totalDinheiro += valor;
        } else if (diarista.formaPagamento.toLowerCase() === 'pix') {
          totalPix += valor;
        }
  
        return [
          diarista.nome,
          diarista.veiculo,
          diarista.cor,
          diarista.placa,
          formatarData(diarista.data),
          diarista.hora,
          formatarValor(diarista.valor),
          diarista.formaPagamento,
        ];
      }),
    });
    
    doc.setFontSize(12);
    const totalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total em Dinheiro: R$ ${totalDinheiro.toFixed(2).replace('.', ',')}`, 14, totalY);
    doc.text(`Total em PIX: R$ ${totalPix.toFixed(2).replace('.', ',')}`, 14, totalY + 5);
    doc.text(`Valor Total: R$ ${totalValor.toFixed(2).replace('.', ',')}`, 14, totalY + 10);
  
    doc.save("relatorio_diaristasepernoites.pdf");
    setIsPdfModalOpen(false);
  };
  
  

  return (
    <section id="mainContent" className="main-content" style={{ width: '100%' }}>
      <div className="m-4" style={{ height: '100vh' }}>
        <h1>Diárias e Pernoites</h1>
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
                  <h5 className="modal-title">Filtrar Diaristas</h5>
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
          <table className="table table-striped table-bordered table-hover table-sm" id="diaristasTable">
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
              {displayedDiaristas.map((diarista, index) => (
                <tr key={index} className="text-center">
                  <td>{diarista.nome}</td>
                  <td>{diarista.veiculo}</td>
                  <td>{diarista.cor}</td>
                  <td>{diarista.placa}</td>
                  <td>{formatarData(diarista.data)}</td>
                  <td>{diarista.hora}</td>
                  <td>{formatarValor(diarista.valor)}</td>
                  <td>{diarista.formaPagamento}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => gerarNotaFiscal(diarista)}
                    >
                      <i className="bi bi-receipt text-white"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Próxima'}
          breakLabel={'...'}
          pageCount={Math.ceil(filteredDiaristas().length / itemsPerPage)}
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

export default Diaristas;
