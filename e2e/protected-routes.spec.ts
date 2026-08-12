import {
  expect,
  test,
} from '@playwright/test';

test.describe('Rotas protegidas de cliente', () => {
  test('deve redirecionar carrinho para login quando não autenticado', async ({
    page,
  }) => {
    await page.goto('/carrinho');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });

  test('deve redirecionar meus pedidos para login quando não autenticado', async ({
    page,
  }) => {
    await page.goto('/meus-pedidos');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });

  test('deve redirecionar perfil para login quando não autenticado', async ({
    page,
  }) => {
    await page.goto('/perfil');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });
});