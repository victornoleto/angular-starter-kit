# Form Validation Directive - Angular 20

Uma diretiva moderna para validação de formulários reativo no Angular 20, utilizando signals e as melhores práticas mais recentes.

## Características

- ✅ **Signals**: Uso completo de signals para estado reativo
- ✅ **Standalone**: Diretiva standalone, sem necessidade de NgModules
- ✅ **TypeScript Strict**: Tipagem completa e estrita
- ✅ **Performance**: Change Detection OnPush e gerenciamento eficiente de estado
- ✅ **Acessibilidade**: Suporte a práticas de acessibilidade
- ✅ **Testável**: Arquitetura testável com dependency injection moderno

## Instalação e Uso

### 1. Importar a diretiva no seu componente

```typescript
import { FormValidationDirective } from './shared/directives/form-validation.directive';

@Component({
    // ...
    imports: [ReactiveFormsModule, FormValidationDirective],
})
export class MeuComponente {
    // ...
}
```

### 2. Usar no template

```html
<form [formGroup]="meuForm()" [appFormValidation]="meuForm()" [formSubmitted]="submitted()" (ngSubmit)="onSubmit()">
    <div class="fc-email">
        <label for="email">Email</label>
        <input id="email" type="email" class="form-control" formControlName="email" />
    </div>

    <button type="submit">Enviar</button>
</form>
```

### 3. Configurar o componente

```typescript
@Component({
    // ...
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeuComponente {
    private readonly fb = inject(FormBuilder);

    readonly meuForm = signal<FormGroup>(
        this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        })
    );

    readonly submitted = signal(false);

    onSubmit(): void {
        this.submitted.set(true);

        if (this.meuForm().valid) {
            // Processar dados
        }
    }
}
```

## Estrutura HTML Necessária

Para que a diretiva funcione corretamente, cada campo deve estar dentro de um container com a classe `fc-{nomeDoControle}`:

```html
<div class="fc-nomeDoControle">
    <label>Label do Campo</label>
    <input class="form-control" formControlName="nomeDoControle" />
    <!-- Mensagens de erro aparecerão automaticamente aqui -->
</div>
```

## Mensagens de Erro Customizadas

### Mensagens Padrão

A diretiva vem com mensagens padrão para os validators mais comuns:

- `required`: "Este campo é obrigatório"
- `email`: "O valor deste campo deve ser um e-mail válido"
- `minlength`: "O campo precisa ter no mínimo {requiredLength} caracteres"
- `maxlength`: "O campo pode ter no máximo {requiredLength} caracteres"
- `min`: "O valor mínimo é {min}"
- `max`: "O valor máximo é {max}"

### Mensagens Customizadas

Você pode definir mensagens customizadas diretamente no validator:

```typescript
// Mensagem como string simples
const control = this.fb.control('', [
    (control: AbstractControl) => {
        return control.value ? null : { required: 'Este campo é obrigatório!' };
    },
]);

// Mensagem em objeto
const control = this.fb.control('', [
    (control: AbstractControl) => {
        return control.value
            ? null
            : {
                  custom: { message: 'Mensagem customizada' },
              };
    },
]);
```

## Estilos CSS

A diretiva adiciona as seguintes classes CSS:

```css
.fc-error {
    /* Aplicada ao container do campo quando há erro */
}

.error-message {
    /* Aplicada à mensagem de erro */
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}
```

## API da Diretiva

### Inputs

- `appFormValidation`: FormGroup - O formulário a ser validado (obrigatório)
- `formSubmitted`: boolean - Estado de submissão do formulário (opcional, padrão: false)

### Métodos Públicos

- `validate(scrollToError?: boolean): boolean` - Valida todos os campos e retorna se o formulário é válido

## Exemplo Completo

Veja o arquivo `example-form.component.ts` para um exemplo completo de uso.

## Migração do Angular 10

### Principais mudanças:

1. **Signals**: `@Input()` → `input()`
2. **Dependency Injection**: Constructor injection → `inject()`
3. **RxJS**: Manual subscription → `takeUntilDestroyed()`
4. **Effects**: `ngOnChanges` → `effect()`
5. **Standalone**: Removida necessidade de NgModule

### Antes (Angular 10):

```typescript
@Input('sys-form') form: FormGroup;
@Input('form-submitted') submitted: boolean;
```

### Depois (Angular 20):

```typescript
readonly form = input.required<FormGroup>({ alias: 'appFormValidation' });
readonly submitted = input<boolean>(false, { alias: 'formSubmitted' });
```

## Testes

Execute os testes com:

```bash
ng test
```

Os testes estão em `form-validation.directive.spec.ts` e cobrem:

- Exibição de mensagens de erro
- Remoção de erros quando campos se tornam válidos
- Aplicação de classes CSS
- Comportamento reativo do estado
