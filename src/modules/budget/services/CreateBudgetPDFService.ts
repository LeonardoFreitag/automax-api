import { injectable, inject } from 'tsyringe';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IBudgetRepository from '@modules/budget/repositories/IBudgetRepository';
import AppError from '@shared/errors/AppError';
import { Budget } from '@prisma/client';
import formatNumber from '@utils/formatNumber';

@injectable()
class CreateBudgetPDFService {
  constructor(
    @inject('BudgetRepository')
    private budgetRepository: IBudgetRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(budgetId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    // Generate PDF
    const tmpFolder = path.resolve(__dirname, '..', '..', '..', '..', 'tmp');

    // console.log(tmpFolder);

    // return;

    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 30,
        bottom: 30,
        left: 30,
        right: 30,
      },
    });
    const writeStream = fs.createWriteStream(`${tmpFolder}/${budgetId}.pdf`);

    doc.pipe(writeStream);

    doc.fontSize(16).text('ESTOFADOS SANTOS LTDA', { align: 'justify' });
    doc
      .fontSize(10)
      .text('R DIEGO BOTELHO (LOT PRQ PAIAGUAS) S/N PAIAGUAS CEP: 78148567', {
        align: 'justify',
      });

    doc.moveDown();
    doc.fontSize(10).text(`Orçamento Nº: ${budget.budgetNumber}`, {
      align: 'left',
      continued: true, // Permite continuar na mesma linha
    });
    doc.text(`Data: ${budget.createdAt.toLocaleString('pt-BR')}`, {
      align: 'right',
    });

    doc
      .moveTo(doc.page.margins.left, doc.y + 5) // Ajusta a posição da linha
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
      .stroke();
    doc.moveDown();
    doc.fontSize(10).text('DADOS DO CLIENTE');
    doc.fontSize(8).text(`Cliente: ${budget.Client.companyName}`);
    doc
      .fontSize(8)
      .text(
        `Endereço: ${budget.Client.streetName}, ${budget.Client.streetNumber}`,
        {
          align: 'left',
          continued: true, // Permite continuar na mesma linha
        },
      );
    doc.fontSize(8).text(`Bairro: ${budget.Client.neighborhood}`, {
      align: 'center',
      continued: true, // Permite continuar na mesma linha
    });
    doc.fontSize(8).text(`CEP: ${budget.Client.zipCode}`, {
      align: 'right',
    });
    doc
      .fontSize(8)
      .text(`Município: ${budget.Client.city} UF: ${budget.Client.state}`);
    doc.fontSize(8).text(`CNPJ: ${budget.Client.cnpj}`, {
      align: 'left',
      continued: true, // Permite continuar na mesma linha
    });
    doc.text(`I.E.: ${budget.Client.ie}`, {
      align: 'right',
    });
    doc
      .moveTo(doc.page.margins.left, doc.y + 5) // Ajusta a posição da linha
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
      .stroke();

    // Define posições X para as colunas
    const xCodigo = 30;
    const xQtde = 80;
    const xDescricao = 120;
    const xUnitario = doc.page.width - 210; // Ajuste a posição X para "Valor Unitário"
    const xTotal = doc.page.width - 80; // Ajuste a posição X para "Valor Total"

    // Posição Y inicial
    const yStart = doc.y + 10;

    // Cabeçalhos
    doc.fontSize(8);
    doc.text('Código', xCodigo, yStart);
    doc.text('Qtde.', xQtde, yStart);
    doc.text('Descrição', xDescricao, yStart, {
      continued: true,
    });
    doc.text('Valor Unitário', xUnitario, yStart);
    doc.text('Valor Total', xTotal, yStart);

    doc
      .moveTo(doc.page.margins.left, doc.y + 5) // Ajusta a posição da linha
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
      .stroke();

    // Itens do orçamento
    let newLinhe = doc.y + 10;
    budget.BudgetItems.forEach(item => {
      doc.fontSize(8);
      doc.text(`${item.code}`, xCodigo, newLinhe);
      doc.text(`${item.quantity}`, xQtde, newLinhe);
      doc.text(`${item.description}`, xDescricao, newLinhe);
      doc.text(
        `${Number(item.price).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
        xUnitario + 40,
        newLinhe,
      );
      doc.text(
        `${Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
        xTotal,
        newLinhe,
      );
      newLinhe += 10;
      doc.text(`COR: ${item.tissueName}`, xDescricao, newLinhe);
      newLinhe += 10;
      doc.text(`Obs.: ${item.notes}`, xQtde, newLinhe);
      newLinhe = doc.y + 10;
    });
    doc
      .moveTo(doc.page.margins.left, doc.y + 5) // Ajusta a posição da linha
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
      .stroke();

    // Observações
    doc.moveDown();

    doc.fontSize(8).text('Observações', xCodigo, doc.y, {
      align: 'left',
      continued: true, // Permite continuar na mesma linha
      width: doc.page.width - 60, // Define a largura máxima
    });
    doc.text(`: ${budget.notes}`, {
      align: 'left',
    });

    doc.fontSize(8).text(
      `Total produtos: ${Number(budget.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      {
        align: 'right',
      },
    );
    doc.fontSize(8).text(
      `Desconto: ${Number(budget.discount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      {
        align: 'right',
      },
    );
    doc.fontSize(8).text(
      `Total geral: ${Number(budget.total).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      {
        align: 'right',
      },
    );

    doc
      .moveTo(doc.page.margins.left, doc.y + 5) // Ajusta a posição da linha
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
      .stroke();

    doc.moveDown();

    doc.fontSize(10).text('Dados de pagamento', {
      align: 'left',
    });

    let newPaymentLine = doc.y + 10;
    budget.BudgetPaymentForm.forEach(paymentForm => {
      doc.fontSize(8).text(` ${paymentForm.description}`, 30, newPaymentLine, {
        align: 'left',
        width: 100, // Define a largura máxima
      });
      doc
        .fontSize(8)
        .text(`Parcelas: ${paymentForm.installments}`, 150, newPaymentLine, {
          align: 'center', // Permite continuar na mesma linha
          width: 50, // Define a largura máxima
        });
      doc.fontSize(8).text(
        `Valor: ${Number(paymentForm.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
        300,
        newPaymentLine,
        {
          align: 'right',
          width: 100, // Define a largura máxima
        },
      );
      newPaymentLine += 10;
    });

    doc
      .moveTo(doc.page.margins.left, doc.y + 5) // Ajusta a posição da linha
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
      .stroke();

    doc.moveDown(10);
    doc.text(`Vendedor: ${budget.Seller.name}`, {
      width: doc.page.width - 60, // Define a largura máxima
      align: 'left',
    });
    doc.end();

    await new Promise(resolve => writeStream.on('finish', resolve));
    writeStream.close(); // Fecha explicitamente o writeStream

    // fs.unlinkSync(`${tmpFolder}/${budgetId}.pdf`);

    // Upload to S3
    const fileName = `${budgetId}.pdf`;
    const fileUrl = await this.storageProvider.saveFile(`${budgetId}.pdf`);
    // const fileUrl = `budget/${budgetId}.pdf`;

    const updatedBudget = await this.budgetRepository.save({
      ...budget,
      budgetFileName: fileName,
      budgetFileUrl: `https://automax.s3.amazonaws.com/${fileUrl}`,
    });
    if (!updatedBudget) {
      // Handle the case where the budget update fails
      throw new AppError('Failed to update budget with file URL', 500);
    }

    // Clean up local file

    return updatedBudget;
  }
}

export default CreateBudgetPDFService;
