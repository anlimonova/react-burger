import { ingredients } from '@utils/ingredients.ts';

import type { IngredientsResponse, OrderResponse } from '@utils/api.ts';

const ingredientsMock: IngredientsResponse = {
  success: true,
  data: ingredients,
};

const orderResponseMock: OrderResponse = {
  success: true,
  name: 'Тестовый бургер',
  order: { number: 123456 },
};

const mockUser = { name: 'Test User', email: 'test@example.com' };

describe('Конструктор бургера: ингредиенты, DnD, модалки и создание заказа', () => {
  const selectors = {
    ingredientCard: '[data-cy=ingredient-card]',
    constructorArea: '[data-cy=constructor-area]',
    constructorBunTop: '[data-cy=constructor-bun-top]',
    constructorBunBottom: '[data-cy=constructor-bun-bottom]',
    constructorFillingList: '[data-cy=constructor-fillings]',
    orderButton: '[data-cy=make-order-button]',
    modalOverlay: '[data-cy=modal-overlay]',
    modalClose: '[data-cy=modal-close]',
    ingredientPage: '[data-cy=ingredient-page]',
    ingredientModal: '[data-cy=ingredient-modal]',
    ingredientName: '[data-cy=ingredient-name]',
    orderModal: '[data-cy=order-modal]',
    orderDetailsNumber: '[data-cy=order-number]',
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('GET', '**/ingredients', ingredientsMock).as('getIngredients');
    cy.intercept('POST', '**/orders*', orderResponseMock).as('makeOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывает модалку ингредиента при клике и закрывает её', () => {
    const first = ingredients[0];

    cy.get(selectors.ingredientCard).first().click();
    cy.get(selectors.ingredientModal).should('be.visible');
    cy.get(selectors.ingredientName).should('contain.text', first.name);
    cy.get('body').type('{esc}');
    cy.get(selectors.ingredientModal).should('not.exist');

    cy.get(selectors.ingredientCard).eq(1).click();
    cy.get(selectors.ingredientModal).should('be.visible');
    cy.get(selectors.modalClose).click();
    cy.get(selectors.ingredientModal).should('not.exist');
  });

  it('перетаскивает ингредиенты в конструктор', () => {
    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('булка')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('Соус')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('салат')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(selectors.constructorBunTop).contains('булка');
    cy.get(selectors.constructorBunBottom).contains('булка');
    cy.get(selectors.constructorFillingList).contains('Соус');
    cy.get(selectors.constructorFillingList).contains('салат');
  });

  it('не добавляет ингредиент, если перетаскивать мимо конструктора', () => {
    cy.get(selectors.constructorFillingList).find('li').should('have.length', 0);

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('Соус')
      .trigger('dragstart');

    cy.get('body').trigger('drop');

    cy.get(selectors.constructorFillingList).find('li').should('have.length', 0);

    cy.get(selectors.constructorBunTop)
      .find('.constructor-element')
      .should('have.length', 0);
    cy.get(selectors.constructorBunBottom)
      .find('.constructor-element')
      .should('have.length', 0);
  });

  it('открывает модалку ингредиента при клике и закрывает её', () => {
    const first = ingredients[0];

    cy.get(selectors.ingredientCard).first().click();
    cy.get(selectors.ingredientModal).should('be.visible');
    cy.get(selectors.ingredientName).should('contain.text', first.name);
    cy.get('body').type('{esc}');
    cy.get(selectors.ingredientModal).should('not.exist');

    cy.get(selectors.ingredientCard).eq(1).click();
    cy.get(selectors.ingredientModal).should('be.visible');
    cy.get(selectors.modalClose).click();
    cy.get(selectors.ingredientModal).should('not.exist');
  });

  it('перетаскивает ингредиенты в конструктор', () => {
    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('булка')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('Соус')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('салат')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(selectors.constructorBunTop).contains('булка');
    cy.get(selectors.constructorBunBottom).contains('булка');
    cy.get(selectors.constructorFillingList).contains('Соус');
    cy.get(selectors.constructorFillingList).contains('салат');
  });

  it('редиректит на страницу логина при попытке заказа без авторизации', () => {
    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('булка')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');
    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('Соус')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(selectors.orderButton).click();
    cy.url().should('include', '/login');
  });
  it('редиректит на страницу логина при попытке заказа без авторизации', () => {
    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('булка')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');
    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('Соус')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(selectors.orderButton).click();
    cy.url().should('include', '/login');
  });

  it('создаёт заказ и открывает модалку с номером при авторизации', () => {
    window.localStorage.setItem('accessToken', 'Bearer test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.window()
      .its('__APP_STORE__')
      .should('exist')
      .then((store: unknown) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        store.dispatch({ type: 'user/setUser', payload: mockUser });
      });

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('булка')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(`${selectors.ingredientCard} ${selectors.ingredientName}`)
      .contains('Соус')
      .trigger('dragstart');
    cy.get(selectors.constructorArea).trigger('drop');

    cy.get(selectors.orderButton).should('not.be.disabled').click();

    cy.wait('@makeOrder', { timeout: 20000 })
      .its('response.statusCode')
      .should('eq', 200);

    cy.get(selectors.orderDetailsNumber).should('be.visible');
    cy.get(selectors.orderDetailsNumber).should(
      'contain.text',
      orderResponseMock.order.number
    );

    cy.get(selectors.modalOverlay).click({ force: true });
    cy.get(selectors.orderDetailsNumber).should('not.exist');
  });

  it('сохраняет детальный просмотр ингредиента после перезагрузки', () => {
    cy.get(selectors.ingredientCard).first().click();
    cy.get(selectors.ingredientModal).should('be.visible');

    cy.location('pathname').should('match', /\/ingredients\/[^/]+$/);

    cy.reload();
    cy.wait('@getIngredients');

    cy.get(selectors.ingredientModal).should('be.visible');
    cy.location('pathname').should('match', /\/ingredients\/[^/]+$/);
  });

  it('открывает детальную страницу ингредиента по прямому URL', () => {
    const first = ingredients[0];
    cy.visit(`/ingredients/${first._id}`);
    cy.wait('@getIngredients');

    cy.get(selectors.ingredientPage).should('have.attr', 'data-cy', 'ingredient-page');
    cy.get(selectors.ingredientName).should('contain.text', first.name);
  });
});
