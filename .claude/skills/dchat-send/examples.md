# Exemplos - D-Chat Send

## Cenário 1: Mensagem Rápida

```
Usuário: "Manda mensagem pro Mauro dizendo que o relatório está pronto"

Ação:
→ Skill: dchat-send
→ Tool: send_message
→ Params:
  {
    "target_type": "user",
    "target": "maurojunior",
    "message": "Oi Mauro, o relatório está pronto!",
    "format": "text"
  }

Resultado: ✅ Mensagem enviada
```

## Cenário 2: Mensagem para Grupo

```
Usuário: "Avisa no grupo 'SSI AI' que a reunião foi cancelada"

Ação:
→ Skill: dchat-send
→ Tool: send_message
→ Params:
  {
    "target_type": "group",
    "target": "SSI AI Initiatives",
    "message": "Pessoal, a reunião de hoje foi cancelada."
  }

Resultado: ✅ Mensagem enviada para o grupo
```

## Cenário 3: Com Formatação Markdown

```
Usuário: "Manda mensagem formatada pro João com os detalhes do deploy"

Ação:
→ Skill: dchat-send
→ Tool: send_message
→ Params:
  {
    "target_type": "user",
    "target": "joao.silva",
    "message": "**Deploy Concluído** ✅\n\n- Versão: 2.5.0\n- Status: Sucesso\n- Link: [Changelog](https://...)",
    "format": "markdown"
  }
```

## Cenário 4: Combinação com Outra Skill

```
Usuário: "Cria um documento no Cooper sobre o incidente e manda o link pro time"

Fluxo:
1. cooper-write → Cria documento
2. dchat-send → Envia link

Mensagem: "Documento do incidente criado: [link]"
```
