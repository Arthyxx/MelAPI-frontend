import {
  expect,
  test,
} from '@playwright/test';

test.describe('Rotas administrativas', () => {
  test('deve redirecionar usuário não autenticado para o login', async ({
    page,
  }) => {
    await page.goto('/admin');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });

  test('deve proteger a página de produtos administrativos', async ({
    page,
  }) => {
    await page.goto('/admin/produtos');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });

  test('deve proteger a página de categorias administrativas', async ({
    page,
  }) => {
    await page.goto('/admin/categorias');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });

  test('deve proteger a página de clientes administrativos', async ({
    page,
  }) => {
    await page.goto('/admin/clientes');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });

  test('deve proteger a página de pedidos administrativos', async ({
    page,
  }) => {
    await page.goto('/admin/pedidos');

    await expect(
      page,
    ).toHaveURL(
      /\/login$/,
    );
  });
});