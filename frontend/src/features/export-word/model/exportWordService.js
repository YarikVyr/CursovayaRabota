const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const safe = (value, fallback = '') => {
  const text = String(value ?? '').trim();
  return text || fallback;
};

const padVersion = (value) => String(safe(value, '1')).padStart(2, '0');

const currentYear = () => new Date().getFullYear();

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const normalizeBase64 = (dataUrl) => {
  if (!dataUrl || !String(dataUrl).startsWith('data:')) return null;

  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  return {
    mimeType: match[1],
    base64: match[2].replace(/\s/g, '')
  };
};

const getImageExtension = (mimeType) => {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/gif') return 'gif';
  return 'bin';
};

const prepareImages = (atmData) => {
  const executor = normalizeBase64(atmData?.executorLogo);
  const customer = normalizeBase64(atmData?.customerLogo);
  const images = [];

  if (executor) {
    images.push({
      ...executor,
      cid: 'executor-logo',
      filename: `executor-logo.${getImageExtension(executor.mimeType)}`
    });
  }

  if (customer) {
    images.push({
      ...customer,
      cid: 'customer-logo',
      filename: `customer-logo.${getImageExtension(customer.mimeType)}`
    });
  }

  return images;
};

const getImageSrc = (images, cid) => {
  const image = images.find((imageItem) => imageItem.cid === cid);
  return image ? `cid:${image.cid}` : '';
};

const getDocumentNumber = (atmData) => {
  return safe(
    atmData?.docNumber,
    `${safe(atmData?.codeType, 'ATM')}.${safe(atmData?.codeValue, '000')}`
  );
};

const getModelName = (atmData) => {
  return safe(atmData?.subsystemName) || safe(atmData?.systemName);
};

const getContractTitle = (atmData) => {
  return safe(
    atmData?.contractName,
    'НАЗВАНИЕ КОНТРАКТА'
  ).toUpperCase();
};

const getApprovalCompanies = (rows) => {
  const approvals = Array.isArray(rows?.approvals) ? rows.approvals : [];

  const companies = approvals.map((company) => {
    const representatives = Array.isArray(company?.representatives)
      ? company.representatives
      : [];

    return {
      name: safe(company?.name, 'Название компании'),
      representatives: representatives.length > 0
        ? representatives.map((rep) => ({
          role: safe(rep?.role, 'Должность'),
          fullName: safe(rep?.fullName, 'ФИО')
        }))
        : [{ role: 'Должность', fullName: 'ФИО' }]
    };
  });

  return companies.length > 0
    ? companies
    : [
      {
        name: 'Название компании',
        representatives: [{ role: 'Должность', fullName: 'ФИО' }]
      },
      {
        name: 'Название компании',
        representatives: [{ role: 'Должность', fullName: 'ФИО' }]
      }
    ];
};

const getApprovalSheetCount = (rows) => {
  const approvalCompanies = getApprovalCompanies(rows);
  return Math.max(1, Math.ceil(approvalCompanies.length / 2));
};

const getSheetCount = (atmData, rows) => {
  const explicitCount = safe(atmData?.sheetCount ?? atmData?.pageCount);
  if (explicitCount) return explicitCount;

  const approvalPages = getApprovalSheetCount(rows);
  const revisionPages = Math.max(1, Math.ceil((rows?.revisions?.length || 1) / 18));

  return String(1 + approvalPages + revisionPages);
};

const getRegistrationSheetNumber = (rows) => {
  return 1 + getApprovalSheetCount(rows) + 1;
};

const normalLine = (content = '&nbsp;') => `
  <p class=MsoNormal align=center style='text-align:center;tab-stops:74.25pt'>
    <span style='font-size:14.0pt;line-height:107%;font-family:"Times New Roman",serif'>
      ${content}
      <o:p></o:p>
    </span>
  </p>
`;

const emptyLines = (count) => {
  return Array.from({ length: count }, () => normalLine('&nbsp;')).join('');
};

const buildShapeType = () => `
  <!--[if gte vml 1]>
  <v:shapetype
    id="_x0000_t75"
    coordsize="21600,21600"
    o:spt="75"
    o:preferrelative="t"
    path="m@4@5l@4@11@9@11@9@5xe"
    filled="f"
    stroked="f"
  >
    <v:stroke joinstyle="miter"/>
    <v:formulas>
      <v:f eqn="if lineDrawn pixelLineWidth 0"/>
      <v:f eqn="sum @0 1 0"/>
      <v:f eqn="sum 0 0 @1"/>
      <v:f eqn="prod @2 1 2"/>
      <v:f eqn="prod @3 21600 pixelWidth"/>
      <v:f eqn="prod @3 21600 pixelHeight"/>
      <v:f eqn="sum @0 0 1"/>
      <v:f eqn="prod @6 1 2"/>
      <v:f eqn="prod @7 21600 pixelWidth"/>
      <v:f eqn="sum @8 21600 0"/>
      <v:f eqn="prod @7 21600 pixelHeight"/>
      <v:f eqn="sum @10 21600 0"/>
    </v:formulas>
    <v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/>
    <o:lock v:ext="edit" aspectratio="t"/>
  </v:shapetype>
  <![endif]-->
`;

const buildHeaderImage = ({
  src,
  id,
  spid,
  widthPt,
  heightPt,
  includeShapeType = false
}) => {
  if (!src) return '';

  return `
    <span style='mso-no-proof:yes'>
      ${includeShapeType ? buildShapeType() : ''}

      <v:shape
        id="${id}"
        o:spid="${spid}"
        type="#_x0000_t75"
        style='width:${widthPt}pt;height:${heightPt}pt;visibility:visible;mso-wrap-style:square'
      >
        <v:imagedata src="${src}" o:title=""/>
      </v:shape>
    </span>
  `;
};

const buildTitleHeader = (images) => {
  const executorSrc = getImageSrc(images, 'executor-logo');
  const customerSrc = getImageSrc(images, 'customer-logo');

  return `
    <div style='mso-element:header' id=h1>
      <table
        border=0
        cellspacing=0
        cellpadding=0
        style='width:100%;border-collapse:collapse;border:none'
      >
        <tr>
          <td width="50%" valign=top style='padding:0cm 5.4pt 0cm 5.4pt'>
            <p class=MsoHeader>
              ${buildHeaderImage({
    src: executorSrc,
    id: 'executor_logo',
    spid: '_x0000_i1025',
    widthPt: 88.5,
    heightPt: 84.75,
    includeShapeType: true
  })}
            </p>
          </td>

          <td width="50%" valign=top style='padding:0cm 5.4pt 0cm 5.4pt'>
            <p class=MsoHeader align=right style='text-align:right'>
              ${buildHeaderImage({
    src: customerSrc,
    id: 'customer_logo',
    spid: '_x0000_i1026',
    widthPt: 74.25,
    heightPt: 84.75
  })}
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const buildApprovalHeader = ({ atmData, currentRevNumber }) => {
  const documentNumber = escapeHtml(getDocumentNumber(atmData));
  const version = escapeHtml(`Версия ${padVersion(currentRevNumber || atmData?.rev)}`);

  return `
    <div style='mso-element:header' id=h2>
      <p class=MsoHeader align=right style='text-align:right'>
        <span style='font-size:14.0pt;font-family:"Times New Roman",serif'>${documentNumber}</span>
      </p>
      <p class=MsoHeader align=right style='text-align:right'>
        <span style='font-size:14.0pt;font-family:"Times New Roman",serif'>${version}</span>
      </p>
    </div>
  `;
};

const buildRegistrationHeader = ({ atmData, rows }) => {
  const sheetNumber = escapeHtml(String(getRegistrationSheetNumber(rows)));
  const documentNumber = escapeHtml(getDocumentNumber(atmData));

  return `
    <div style='mso-element:header' id=h3>
      <p class=MsoHeader align=center style='text-align:center'>
        <span style='font-size:14.0pt;font-family:"Times New Roman",serif'>${sheetNumber}</span>
      </p>
      <p class=MsoHeader align=center style='text-align:center'>
        <span style='font-size:14.0pt;font-family:"Times New Roman",serif'>${documentNumber}</span>
      </p>
    </div>
  `;
};

const buildTitlePage = ({ atmData, rows, currentRevNumber }) => {
  const contractTitle = escapeHtml(getContractTitle(atmData));
  const modelName = escapeHtml(`Модель ${getModelName(atmData)}`);
  const documentNumber = escapeHtml(getDocumentNumber(atmData));
  const version = escapeHtml(`Версия ${padVersion(currentRevNumber || atmData?.rev)}`);
  const sheets = escapeHtml(`Листов ${getSheetCount(atmData, rows)}`);

  return `
    <div class=WordSection1>
      ${emptyLines(9)}

      ${normalLine(contractTitle)}
      ${emptyLines(1)}

      ${normalLine(modelName)}
      ${normalLine('Программа и методика испытаний (АТМ)')}
      ${normalLine(documentNumber)}
      ${emptyLines(1)}

      ${normalLine(version)}
      ${emptyLines(1)}

      ${normalLine(sheets)}

      ${emptyLines(6)}

      ${normalLine('Москва')}
      ${normalLine(String(currentYear()))}
    </div>
  `;
};

const approvalText = (content = '&nbsp;') => `
  <p class=MsoNormal align=center style='text-align:center;tab-stops:74.25pt'>
    <span style='font-size:14.0pt;line-height:107%;font-family:"Times New Roman",serif'>
      ${content}
      <o:p></o:p>
    </span>
  </p>
`;

const approvalCell = (content) => `
  <td width="50%" valign=top style='width:50%;padding:0cm 5.4pt 0cm 5.4pt'>
    ${approvalText(content)}
  </td>
`;

const buildApprovalRow = (leftContent, rightContent = '&nbsp;') => `
  <tr>
    ${approvalCell(leftContent)}
    ${approvalCell(rightContent)}
  </tr>
`;

const buildApprovalCompanyBlock = (leftCompany, rightCompany) => {
  const maxRepresentatives = Math.max(
    leftCompany?.representatives?.length || 0,
    rightCompany?.representatives?.length || 0
  );
  const dateText = escapeHtml(`«___» ____________ ${currentYear()} г.`);
  const representativeRows = [];

  for (let index = 0; index < maxRepresentatives; index += 1) {
    const leftRep = leftCompany?.representatives?.[index];
    const rightRep = rightCompany?.representatives?.[index];

    representativeRows.push(buildApprovalRow(
      leftRep ? escapeHtml(leftRep.role) : '&nbsp;',
      rightRep ? escapeHtml(rightRep.role) : '&nbsp;'
    ));
    representativeRows.push(buildApprovalRow(
      leftRep ? escapeHtml(`____________ ${leftRep.fullName}`) : '&nbsp;',
      rightRep ? escapeHtml(`____________ ${rightRep.fullName}`) : '&nbsp;'
    ));
    representativeRows.push(buildApprovalRow(
      leftRep ? dateText : '&nbsp;',
      rightRep ? dateText : '&nbsp;'
    ));

    if (index < maxRepresentatives - 1) {
      representativeRows.push(buildApprovalRow('&nbsp;', '&nbsp;'));
    }
  }

  return `
    <table
      class=MsoTableGrid
      border=0
      cellspacing=0
      cellpadding=0
      style='width:100%;border-collapse:collapse;border:none;mso-yfti-tbllook:1184;page-break-inside:auto'
    >
      ${buildApprovalRow(
    escapeHtml(leftCompany?.name || 'Название компании'),
    rightCompany ? escapeHtml(rightCompany.name) : '&nbsp;'
  )}
      ${buildApprovalRow('&nbsp;', '&nbsp;')}
      ${representativeRows.join('')}
    </table>
  `;
};

const buildApprovalPage = ({ atmData, rows, currentRevNumber }) => {
  const companies = getApprovalCompanies(rows);
  const blocks = [];

  for (let index = 0; index < companies.length; index += 2) {
    const blockGap = index > 0 ? `${emptyLines(2)}` : '';
    const blockStyle = index > 0 ? 'margin-top:24pt;' : '';

    blocks.push(`
      <div style='${blockStyle}'>
        ${blockGap}
        ${buildApprovalCompanyBlock(companies[index], companies[index + 1])}
      </div>
    `);
  }

  return `
    <br clear=all style='page-break-before:always;mso-break-type:section-break'>
    ${buildApprovalHeader({ atmData, currentRevNumber })}
    <div class=WordSection2>
      ${normalLine('&nbsp;')}

      <p class=MsoNormal align=center style='text-align:center;tab-stops:74.25pt'>
        <b>
          <span style='font-size:14.0pt;line-height:107%;font-family:"Times New Roman",serif'>
            ЛИСТ СОГЛАСОВАНИЯ
            <o:p></o:p>
          </span>
        </b>
      </p>

      ${blocks.join('')}
    </div>
  `;
};

const revisionNameMap = {
  1: 'Первоначальная версия',
  2: 'Вторая версия документа',
  3: 'Третья версия документа',
  4: 'Четвертая версия документа',
  5: 'Пятая версия документа',
  6: 'Шестая версия документа',
  7: 'Седьмая версия документа',
  8: 'Восьмая версия документа',
  9: 'Девятая версия документа',
  10: 'Десятая версия документа',
  11: 'Одиннадцатая версия документа',
  12: 'Двенадцатая версия документа',
  13: 'Тринадцатая версия документа',
  14: 'Четырнадцатая версия документа',
  15: 'Пятнадцатая версия документа',
  16: 'Шестнадцатая версия документа',
  17: 'Семнадцатая версия документа',
  18: 'Восемнадцатая версия документа',
  19: 'Девятнадцатая версия документа',
  20: 'Двадцатая версия документа'
};

const getRevisionDescription = (revision, index) => {
  const revisionNumber = Number(revision?.rev || index + 1);
  if (revisionNameMap[revisionNumber]) return revisionNameMap[revisionNumber];

  return `${revisionNumber}-я версия документа`;
};

const getRevisionRows = (rows) => {
  const revisions = Array.isArray(rows?.revisions) ? rows.revisions : [];

  return revisions.length > 0
    ? revisions
    : [{
      rev: '1',
      desc: 'Первоначальная версия',
      reason: '',
      date: new Date().toLocaleDateString('ru-RU')
    }];
};

const revisionCell = (content, width, align = 'center') => `
  <td width="${width}" valign=top style='width:${width};border:solid windowtext 1.0pt;mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
    <p class=MsoNormal align=${align} style='text-align:${align}'>
      <span style='font-size:14.0pt;line-height:107%;font-family:"Times New Roman",serif'>
        ${content || '&nbsp;'}
        <o:p></o:p>
      </span>
    </p>
  </td>
`;

const buildRevisionTableRow = ({ version, description, reason, date, isHeader = false }) => {
  const wrap = (value) => (isHeader ? `<b>${value}</b>` : value);

  return `
    <tr style='page-break-inside:avoid'>
      ${revisionCell(wrap(version), '15.5%')}
      ${revisionCell(wrap(description), '41%')}
      ${revisionCell(wrap(reason), '28%')}
      ${revisionCell(wrap(date), '15.5%')}
    </tr>
  `;
};

const buildRegistrationPage = ({ atmData, rows }) => {
  const revisionRows = getRevisionRows(rows);
  const bodyRows = revisionRows.map((revision, index) => buildRevisionTableRow({
    version: escapeHtml(revision?.rev || index + 1),
    description: escapeHtml(getRevisionDescription(revision, index)),
    reason: escapeHtml(safe(revision?.reason)),
    date: escapeHtml(safe(revision?.date))
  }));

  return `
    <br clear=all style='page-break-before:always;mso-break-type:section-break'>
    ${buildRegistrationHeader({ atmData, rows })}
    <div class=WordSection3>
      ${normalLine('&nbsp;')}

      <p class=MsoNormal align=center style='text-align:center'>
        <b>
          <span style='font-size:14.0pt;line-height:107%;font-family:"Times New Roman",serif'>
            ИСТОРИЯ ИЗМЕНЕНИЙ
            <o:p></o:p>
          </span>
        </b>
      </p>

      <table
        class=MsoTableGrid
        border=1
        cellspacing=0
        cellpadding=0
        style='width:100%;border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt;page-break-inside:auto'
      >
        ${buildRevisionTableRow({
    version: 'ВЕРСИЯ',
    description: 'ОПИСАНИЕ',
    reason: 'ПРИЧИНА',
    date: 'ДАТА',
    isHeader: true
  })}
        ${bodyRows.join('')}
      </table>
    </div>
  `;
};

const buildHtml = ({ atmData, rows, currentRevNumber, images }) => `
<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
  xmlns="http://www.w3.org/TR/REC-html40"
>
<head>
  <meta http-equiv=Content-Type content="text/html; charset=utf-8">
  <meta name=ProgId content=Word.Document>
  <meta name=Generator content="Microsoft Word 15">
  <meta name=Originator content="Microsoft Word 15">

  <!--[if !mso]>
  <style>
    v\\:* {behavior:url(#default#VML);}
    o\\:* {behavior:url(#default#VML);}
    w\\:* {behavior:url(#default#VML);}
    .shape {behavior:url(#default#VML);}
  </style>
  <![endif]-->

  <style>
    p.MsoNormal,
    li.MsoNormal,
    div.MsoNormal {
      margin-top: 0cm;
      margin-right: 0cm;
      margin-bottom: 8.0pt;
      margin-left: 0cm;
      line-height: 107%;
      mso-pagination: widow-orphan;
      font-size: 11.0pt;
      font-family: "Calibri", sans-serif;
      mso-fareast-language: EN-US;
    }

    p.MsoHeader,
    li.MsoHeader,
    div.MsoHeader {
      margin: 0cm;
      margin-bottom: .0001pt;
      mso-pagination: widow-orphan;
      tab-stops: center 233.85pt right 467.75pt;
      font-size: 11.0pt;
      font-family: "Calibri", sans-serif;
      mso-fareast-language: EN-US;
    }

    @page WordSection1 {
      size: 595.3pt 841.9pt;
      margin: 49.6pt 39.7pt 34.0pt 53.85pt;
      mso-header-margin: 35.45pt;
      mso-footer-margin: 35.45pt;
      mso-header: h1;
      mso-paper-source: 0;
    }

    @page WordSection2 {
      size: 595.3pt 841.9pt;
      margin: 49.6pt 39.7pt 34.0pt 53.85pt;
      mso-header-margin: 35.45pt;
      mso-footer-margin: 35.45pt;
      mso-header: h2;
      mso-paper-source: 0;
    }

    @page WordSection3 {
      size: 595.3pt 841.9pt;
      margin: 49.6pt 39.7pt 34.0pt 53.85pt;
      mso-header-margin: 35.45pt;
      mso-footer-margin: 35.45pt;
      mso-header: h3;
      mso-paper-source: 0;
    }

    div.WordSection1 {
      page: WordSection1;
    }

    div.WordSection2 {
      page: WordSection2;
    }

    div.WordSection3 {
      page: WordSection3;
    }
  </style>
</head>

<body lang=RU style='tab-interval:35.4pt'>
  ${buildTitleHeader(images)}
  ${buildTitlePage({ atmData, rows, currentRevNumber })}
  ${buildApprovalPage({ atmData, rows, currentRevNumber })}
  ${buildRegistrationPage({ atmData, rows })}
</body>
</html>
`;

const wrapBase64 = (value) => {
  return value.match(/.{1,76}/g)?.join('\r\n') || '';
};

const buildMhtml = (html, images) => {
  const boundary = `----=_NextPart_${Date.now()}`;

  const htmlPart = [
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    'Content-Transfer-Encoding: 8bit',
    'Content-Location: file:///title.htm',
    '',
    html
  ].join('\r\n');

  const imageParts = images.map((image) => [
    `--${boundary}`,
    `Content-Type: ${image.mimeType}`,
    'Content-Transfer-Encoding: base64',
    `Content-Location: ${image.filename}`,
    `Content-ID: <${image.cid}>`,
    'Content-Disposition: inline',
    '',
    wrapBase64(image.base64)
  ].join('\r\n'));

  return [
    'MIME-Version: 1.0',
    `Content-Type: multipart/related; boundary="${boundary}"; type="text/html"`,
    '',
    htmlPart,
    ...imageParts,
    `--${boundary}--`
  ].join('\r\n');
};

const getPreviewImageSrc = (images, cid) => {
  const image = images.find((imageItem) => imageItem.cid === cid);
  return image ? `data:${image.mimeType};base64,${image.base64}` : '';
};

const buildPreviewTitleHeader = (images) => {
  const executorSrc = getPreviewImageSrc(images, 'executor-logo');
  const customerSrc = getPreviewImageSrc(images, 'customer-logo');

  return `
    <table class="preview-title-header">
      <tr>
        <td>${executorSrc ? `<img src="${executorSrc}" alt="">` : ''}</td>
        <td>${customerSrc ? `<img src="${customerSrc}" alt="">` : ''}</td>
      </tr>
    </table>
  `;
};

const buildPreviewPageHtml = ({ page, atmData, rows, currentRevNumber, images }) => {
  const sectionMap = {
    title: `
      ${buildPreviewTitleHeader(images)}
      ${buildTitlePage({ atmData, rows, currentRevNumber })}
    `,
    approval: `
      ${buildApprovalHeader({ atmData, currentRevNumber })}
      <div class=WordSection2>
        ${normalLine('&nbsp;')}
        <p class=MsoNormal align=center style='text-align:center;tab-stops:74.25pt'>
          <b>
            <span style='font-size:14.0pt;line-height:107%;font-family:"Times New Roman",serif'>
            &#1051;&#1048;&#1057;&#1058; &#1057;&#1054;&#1043;&#1051;&#1040;&#1057;&#1054;&#1042;&#1040;&#1053;&#1048;&#1071;
              <o:p></o:p>
            </span>
          </b>
        </p>
        ${(() => {
    const companies = getApprovalCompanies(rows);
    const blocks = [];

    for (let index = 0; index < companies.length; index += 2) {
      const blockGap = index > 0 ? `${emptyLines(2)}` : '';
      const blockStyle = index > 0 ? 'margin-top:24pt;' : '';

      blocks.push(`
        <div style='${blockStyle}'>
          ${blockGap}
          ${buildApprovalCompanyBlock(companies[index], companies[index + 1])}
        </div>
      `);
    }

    return blocks.join('');
  })()}
      </div>
    `,
    registration: `
      ${buildRegistrationPage({ atmData, rows }).replace(/<br clear=all[^>]*>/, '')}
    `
  };

  return `
    <style>
      body {
        margin: 0;
        background: transparent;
      }

      .word-preview-page {
        width: 595.3pt;
        min-height: 841.9pt;
        box-sizing: border-box;
        background: #fff;
        color: #000;
        padding: 49.6pt 39.7pt 34pt 53.85pt;
        font-family: "Times New Roman", serif;
      }

      p.MsoNormal,
      p.MsoHeader {
        margin-top: 0;
        margin-right: 0;
        margin-left: 0;
      }

      p.MsoNormal {
        margin-bottom: 8pt;
        line-height: 107%;
      }

      p.MsoHeader {
        margin-bottom: 0;
      }

      .preview-title-header {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 62pt;
      }

      .preview-title-header td {
        width: 50%;
        vertical-align: top;
        border: 0;
        padding: 0;
      }

      .preview-title-header td:last-child {
        text-align: right;
      }

      .preview-title-header img {
        width: 88.5pt;
        height: 84.75pt;
        object-fit: contain;
      }

      .preview-title-header td:last-child img {
        width: 74.25pt;
      }

      table {
        page-break-inside: auto;
      }
    </style>
    <div class="word-preview-page">
      ${sectionMap[page] || sectionMap.title}
    </div>
  `;
};

export const exportWordService = {
  getPreviewHtml(payload, page) {
    const images = prepareImages(payload.atmData);
    return buildPreviewPageHtml({ ...payload, images, page });
  },

  exportFirstThreePages(payload) {
    const images = prepareImages(payload.atmData);
    const html = buildHtml({ ...payload, images });
    const mhtml = buildMhtml(html, images);

    const blob = new Blob(['\ufeff', mhtml], {
      type: 'application/msword;charset=utf-8'
    });

    const filename = `${safe(getDocumentNumber(payload.atmData), 'ATM')}_title_approval_Rev_${padVersion(
      payload.currentRevNumber || payload.atmData?.rev
    )}.doc`;

    // downloadBlob(blob, filename.replace(/[\\/:*?"<>|]/g, '_'));
  }
};
