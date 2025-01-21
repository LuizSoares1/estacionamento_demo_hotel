import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import "../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [valorTotalResumo, setValorTotalResumo] = useState({
    quantidade: {
      diaristas: 0,
      mensalistas: 0,
      lavaJato: 0,
      total: 0,
    },
    valorTotal: {
      diaristas: 'R$ 0,00',
      mensalistas: 'R$ 0,00',
      lavaJato: 'R$ 0,00',
      geral: 'R$ 0,00',
    },
  });
  const [lavaJatoResumo, setLavaJatoResumo] = useState({ quantidade: 0, valorTotal: 'R$ 0,00' });
  const [diariasResumo, setDiariasResumo] = useState({ quantidade: 0, valorTotal: 'R$ 0,00' });
  const [mensalistasResumo, setMensalistasResumo] = useState({ quantidade: 0, valorTotal: 'R$ 0,00' });
  const [dadosMensais, setDadosMensais] = useState({
    diaristas: Array(12).fill(0),
    mensalistas: Array(12).fill(0),
    lavajato: Array(12).fill(0),
  });

  useEffect(() => {
    const diaristas = localStorage.getItem('diaristas');
    const mensalistas = localStorage.getItem('mensalistas');
    const lavajato = localStorage.getItem('lavajato');

    let totalValorDiaristas = 0;
    let totalValorMensalistas = 0;
    let totalValorLavaJato = 0;
    let quantidadeDiaristas = 0;
    let quantidadeMensalistas = 0;
    let quantidadeLavaJato = 0;

    const novosDadosMensais = {
      diaristas: Array(12).fill(0),
      mensalistas: Array(12).fill(0),
      lavajato: Array(12).fill(0),
    };

    if (diaristas) {
      const diaristasArray = JSON.parse(diaristas);
      totalValorDiaristas = diaristasArray.reduce((acc, item) => {
        const valor = parseFloat(item.valor);
        const mes = new Date(item.data).getMonth();
        novosDadosMensais.diaristas[mes] += valor;
        return acc + valor;
      }, 0);
      quantidadeDiaristas = diaristasArray.length;

      setDiariasResumo({
        quantidade: quantidadeDiaristas,
        valorTotal: `R$ ${totalValorDiaristas.toFixed(2).replace('.', ',')}`,
      });
    }

    if (mensalistas) {
      const mensalistasArray = JSON.parse(mensalistas);
      totalValorMensalistas = mensalistasArray.reduce((acc, item) => {
        const valor = parseFloat(item.valor);
        const mes = new Date(item.dataInicio).getMonth();
        novosDadosMensais.mensalistas[mes] += valor;
        return acc + valor;
      }, 0);
      quantidadeMensalistas = mensalistasArray.length;

      setMensalistasResumo({
        quantidade: quantidadeMensalistas,
        valorTotal: `R$ ${totalValorMensalistas.toFixed(2).replace('.', ',')}`,
      });
    }

    if (lavajato) {
      const lavajatoArray = JSON.parse(lavajato);
      totalValorLavaJato = lavajatoArray.reduce((acc, item) => {
        const valor = parseFloat(item.valor);
        const mes = new Date(item.data).getMonth();
        novosDadosMensais.lavajato[mes] += valor;
        return acc + valor;
      }, 0);
      quantidadeLavaJato = lavajatoArray.length;

      setLavaJatoResumo({
        quantidade: quantidadeLavaJato,
        valorTotal: `R$ ${totalValorLavaJato.toFixed(2).replace('.', ',')}`,
      });
    }

    const totalGeral = totalValorDiaristas + totalValorMensalistas + totalValorLavaJato;
    const totalQuantidade = quantidadeDiaristas + quantidadeMensalistas + quantidadeLavaJato;

    setValorTotalResumo({
      quantidade: {
        diaristas: quantidadeDiaristas,
        mensalistas: quantidadeMensalistas,
        lavaJato: quantidadeLavaJato,
        total: totalQuantidade,
      },
      valorTotal: {
        diaristas: `R$ ${totalValorDiaristas.toFixed(2).replace('.', ',')}`,
        mensalistas: `R$ ${totalValorMensalistas.toFixed(2).replace('.', ',')}`,
        lavaJato: `R$ ${totalValorLavaJato.toFixed(2).replace('.', ',')}`,
        geral: `R$ ${totalGeral.toFixed(2).replace('.', ',')}`,
      },
    });

    setDadosMensais(novosDadosMensais);
    console.log('Dados Mensais Atualizados:', novosDadosMensais);
  }, []);

  const barChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Diaristas',
        data: dadosMensais.diaristas,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Mensalistas',
        data: dadosMensais.mensalistas,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Lava Jato',
        data: dadosMensais.lavajato,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: function (value: number) {
            return `R$ ${value.toFixed(2).replace('.', ',')}`;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `${context.dataset.label}: R$ ${value.toFixed(2).replace('.', ',')}`;
          },
        },
      },
    },
  };

  const doughnutData = {
    labels: ['Diaristas', 'Mensalistas', 'Lava Jato'],
    datasets: [
      {
        data: [
          diariasResumo.quantidade,
          mensalistasResumo.quantidade,
          lavaJatoResumo.quantidade,
        ],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <section id="mainContent" className="main-content" style={{ width: '100%' }}>
      <div className="p-4">
        <h1 className="my-4">Dashboard</h1>
        <div className="row">
          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-blue order-card">
              <div className="card-block">
                <h4 className="m-b-20">Diárias</h4>
                <h2 className="text-right">
                  <i className="fa fa-cart-plus f-left"></i>
                  <span>{diariasResumo.valorTotal}</span>
                </h2>
                <p className="m-b-0">
                  Veículos Estacionados<span className="f-right">{diariasResumo.quantidade}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-green order-card">
              <div className="card-block">
                <h4 className="m-b-20">Mensalistas</h4>
                <h2 className="text-right">
                  <i className="fa fa-rocket f-left"></i>
                  <span>{mensalistasResumo.valorTotal}</span>
                </h2>
                <p className="m-b-0">
                  Mensalistas Ativos<span className="f-right">{mensalistasResumo.quantidade}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-yellow order-card">
              <div className="card-block">
                <h4 className="m-b-20">Lava Jato</h4>
                <h2 className="text-right">
                  <i className="fa fa-refresh f-left"></i>
                  <span>{lavaJatoResumo.valorTotal}</span>
                </h2>
                <p className="m-b-0">
                  Clientes<span className="f-right">{lavaJatoResumo.quantidade}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-xl-3">
            <div className="card bg-c-pink order-card">
              <div className="card-block">
                <h4 className="m-b-20">Totais Mensal</h4>
                <h2 className="text-right">
                  <i className="fa fa-credit-card f-left"></i>
                  <span>{valorTotalResumo.valorTotal.geral}</span>
                </h2>
                <p className="m-b-0">
                  Vendas Totais<span className="f-right">{valorTotalResumo.quantidade.total}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row my-4 graficosDiv">
          <div className="col-md-6">
            <h4 className="text-center">Crescimento Mensal</h4>
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          <div className="col-md-6 dougnutDiv">
            <h4 className="text-center">Participação dos Serviços</h4>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <footer className="footerContainer py-4" style={{ backgroundColor: '#f5f5f5' }}>
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

export default Dashboard;
