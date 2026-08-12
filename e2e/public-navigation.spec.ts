import {
  expect,
  test,
} from '@playwright/test';

test.describe('Navegação pública', () => {
  test('deve redirecionar a rota inicial para produtos', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page,
    ).toHaveURL(
      /\/produtos$/,
    );
  });
});