import { useTogglePassword } from '@/hooks/useTogglePassword.js';
import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';

import type { TFormInputField, TFormLink } from '@utils/types';
import type { FC, FormEvent } from 'react';

import styles from './auth-form.module.css';

type TAuthFormProps = {
  mode?: string;
  title?: string;
  inputs: TFormInputField[];
  mainButtonText?: string;
  handleSubmit?: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  secondaryButtonText?: string;
  handleSecondaryButtonClick?: () => void;
  links?: TFormLink[];
};

export const AuthForm: FC<TAuthFormProps> = ({
  mode,
  title,
  inputs,
  mainButtonText,
  handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  },
  links,
  secondaryButtonText,
  handleSecondaryButtonClick,
}) => {
  const { iconName, passwordInputType, onIconClick } = useTogglePassword();

  return (
    <section
      className={`${styles.centered} ${mode ? styles[mode as keyof typeof styles] : ''}`}
    >
      {title && <h1 className={'text text_type_main-medium mb-6'}>{title}</h1>}
      <form
        className={`${styles.form}`}
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
      >
        {inputs.map((input) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          <Input
            key={input.name}
            type={input.type === 'password' ? passwordInputType : input.type}
            placeholder={input.placeholder}
            onChange={(e) => input.onChange(e)}
            icon={input.type === 'password' ? iconName : undefined}
            onIconClick={input.type === 'password' ? onIconClick : undefined}
            name={input.name}
            value={input.value}
          />
        ))}
        <div className={secondaryButtonText && `${styles.buttons}`}>
          {secondaryButtonText && (
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              onClick={handleSecondaryButtonClick}
            >
              {secondaryButtonText}
            </Button>
          )}
          {mainButtonText && (
            <Button htmlType="submit" type="primary" size="medium">
              {mainButtonText}
            </Button>
          )}
        </div>
      </form>
      {links && (
        <div className={`${styles.links} mt-20`}>
          {links.map((link, index) => (
            <span
              key={index}
              className={'text text_type_main-default' + (index > 0 ? ' mt-1' : '')}
            >
              {link.text} <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </div>
      )}
    </section>
  );
};
