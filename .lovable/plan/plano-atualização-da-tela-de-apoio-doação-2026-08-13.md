# Plano — Atualização da Tela de Apoio (Doação)

O objetivo é atualizar a tela de doação para remover o QR Code e as informações do C6 Bank, substituindo-as por um novo código PIX "Copia e Cola" com o nome de Murilo Silva, conforme as preferências de layout (código visível + botão para copiar).

## 1. Alterações de Conteúdo
- **Remover QR Code:** O arquivo `qrcode-c6.png.asset.json` e a imagem correspondente serão removidos do layout.
- **Remover C6 Bank:** O texto referente ao banco C6 será excluído.
- **Novo Código PIX:** Atualizar a constante `PIX_COPIA_E_COLA` para o valor fornecido: `00020101021126420014br.gov.bcb.pix0120olirumdev1@gmail.com5204000053039865802BR5918MURILO SILVA - PIJ6008BRASILIA62070503***630432FF`.
- **Favorecido:** Mudar de "Murilo Ferreira da Silva" para "MURILO SILVA - PIJ".

## 2. Ajustes de UI (Conforme Respostas Interativas)
- **Layout de Código Visível:** O código PIX será exibido em uma caixa de texto (readonly) ou container estilizado com borda HQ.
- **Botão de Copiar:** O botão agora exibirá o texto do código (ou parte dele) e terá um rótulo claro de "Copiar PIX".
- **Feedback:** Manter a mensagem de confirmação "✓ Código Pix copiado!" após o clique.
- **Responsividade:** Garantir que a caixa de código quebre corretamente em telas pequenas sem quebrar o layout.

## 3. Arquivos Impactados
- `src/routes/doacao.tsx`: Refatoração total do componente e limpeza de imports não utilizados (como o asset do QR Code).

## 4. Validação
- O código copiado deve ser exatamente o novo fornecido.
- A página deve ficar limpa e focada no botão de cópia, sem elementos do banco anterior.
- Testar a cópia em mobile e desktop.

Aprova para eu executar?