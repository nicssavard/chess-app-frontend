import BoardPosition from "@/components/chess/BoardPosition";
test("BoardPosition", () => {
  const bPosition = new BoardPosition(3, 3);
  expect(bPosition.x).toBe(3);
  expect(bPosition.y).toBe(3);
  expect(bPosition.toChessNotation()).toBe("d4");
  expect(bPosition.add(1, 1).toChessNotation()).toBe("e5");
  expect(bPosition.add(-1, -1).toChessNotation()).toBe("c3");
  expect(bPosition.add(0, 0).toChessNotation()).toBe("d4");
  expect(bPosition.add(0, 1).toChessNotation()).toBe("d5");
  expect(bPosition.add(1, 0).toChessNotation()).toBe("e4");
  expect(bPosition.add(-1, 0).toChessNotation()).toBe("c4");
  expect(bPosition.add(0, -1).toChessNotation()).toBe("d3");
});
