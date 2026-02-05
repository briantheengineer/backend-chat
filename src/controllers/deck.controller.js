import prisma from "../lib/prisma.js";

export async function createDeck(req, res) {
  try {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ error: "Nome do deck é obrigatório" });
    }

    const deck = await prisma.deck.create({
      data: {
        name,
        userId
      }
    });

    return res.status(201).json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar deck" });
  }
}

export async function listDecks(req, res) {
  try {
    const userId = req.userId;

    const decks = await prisma.deck.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return res.json(decks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar decks" });
  }
}

export async function deleteDeck(req, res) {
  try {
    const { deckId } = req.params;
    const userId = req.userId;

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId
      }
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck não encontrado" });
    }

    await prisma.deck.delete({
      where: { id: deckId }
    });

    return res.json({ message: "Deck deletado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar deck" });
  }
}

export async function getDeck(req, res) {
  try {
    const { deckId } = req.params;
    const userId = req.userId;

    const deck = await prisma.deck.findFirst({
      where: {
        id: deckId,
        userId
      }
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck não encontrado" });
    }

    return res.json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar deck" });
  }
}
