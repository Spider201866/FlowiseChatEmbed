import { ShortTextInput } from './ShortTextInput';
import { isMobile } from '@/utils/isMobileSignal';
import { createSignal, createEffect, onMount, Setter } from 'solid-js';
import { SendButton } from '@/components/buttons/SendButton';
import { FileEvent, UploadsConfig } from '@/components/Bot';
import { ImageUploadButton } from '@/components/buttons/ImageUploadButton';
import { RecordAudioButton } from '@/components/buttons/RecordAudioButton';

type Props = {
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  sendButtonColor?: string;
  defaultValue?: string;
  fontSize?: number;
  disabled?: boolean;
  onSubmit: (value: string) => void;
  uploadsConfig?: Partial<UploadsConfig>;
  setPreviews: Setter<unknown[]>;
  onMicrophoneClicked: () => void;
  handleFileChange: (event: FileEvent<HTMLInputElement>) => void;
};

const defaultBackgroundColor = '#ffffff';
const defaultTextColor = '#303235';

export const TextInput = (props: Props) => {
  const [inputValue, setInputValue] = createSignal(props.defaultValue ?? '');
  let inputRef: HTMLTextAreaElement | undefined;
  let fileUploadRef: HTMLInputElement | undefined;

  const handleInput = (inputValue: string) => setInputValue(inputValue);

  const checkIfInputIsValid = () => inputValue() !== '' && inputRef?.reportValidity();

  const submit = () => {
    if (checkIfInputIsValid()) props.onSubmit(inputValue());
    setInputValue('');
  };

  const submitWhenEnter = (e: KeyboardEvent) => {
    // Check if IME composition is in progress
    const isIMEComposition = e.isComposing || e.keyCode === 229;
    if (e.key === 'Enter' && !isIMEComposition) submit();
  };

  const handleImageUploadClick = () => {
    if (fileUploadRef) fileUploadRef.click();
  };

  createEffect(() => {
    if (!props.disabled && !isMobile() && inputRef) inputRef.focus();
  });

  onMount(() => {
    if (!isMobile() && inputRef) inputRef.focus();
  });

  const handleFileChange = (event: FileEvent<HTMLInputElement>) => {
    props.handleFileChange(event);
    // 👇️ reset file input
    if (event.target) event.target.value = '';
  };

  return (
    <div
      class={'w-full h-auto flex items-end justify-between chatbot-input'}
      data-testid="input"
      style={{
        margin: 'auto',
        'background-color': '#f4f4f4', // Grey background
        color: props.textColor ?? defaultTextColor,
        'border-radius': '21px', // Rounded corners
        border: 'none', // No border
        'box-shadow': 'none', // No shadow
        padding: '5px 10px', // Padding for better aesthetics
        'font-family': 'Calibri Light, sans-serif', // Font family
        'min-height': '20px', // Adjusted min-height for single line
        'max-height': '128px', // Maximum height to fit more lines
        'align-items': 'center', // Center align items vertically
      }}
      onKeyDown={submitWhenEnter}
    >
      {props.uploadsConfig?.isImageUploadAllowed ? (
        <>
          <ImageUploadButton
            buttonColor={props.sendButtonColor}
            type="button"
            class="m-0 h-14 flex items-center justify-center"
            isDisabled={props.disabled}
            on:click={handleImageUploadClick}
          >
            <span style={{ 'font-family': 'Poppins, sans-serif' }}>Image Upload</span>
          </ImageUploadButton>
          <input style={{ display: 'none' }} multiple ref={fileUploadRef as HTMLInputElement} type="file" onChange={handleFileChange} />
        </>
      ) : null}
      <textarea
        ref={inputRef as HTMLTextAreaElement}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto'; // Reset height
          target.style.height = `${target.scrollHeight}px`; // Set to scroll height
          setInputValue(target.value);
        }}
        value={inputValue()}
        placeholder={props.placeholder ?? 'Message Alan...'}
        disabled={props.disabled}
        style={{
          width: '100%', // Ensure the input takes full width
          height: 'auto', // Let the height adjust based on content
          resize: 'none', // Prevent manual resizing
          'background-color': '#f4f4f4', // Match the div's background color
          color: props.textColor ?? defaultTextColor,
          'font-family': 'Poppins, sans-serif', // Font family
          'border-radius': '25px', // Rounded corners
          padding: '0 20px', // Removed padding inside the textarea to better align text
          'box-sizing': 'border-box', // Ensure padding is included in the height
          'overflow-y': 'hidden', // Hide the scrollbar
          border: 'none', // No border
          'line-height': '20px', // Adjust line height for centering text
          outline: 'none', // Remove outline on focus
        }}
      />
      {props.uploadsConfig?.isSpeechToTextEnabled ? (
        <RecordAudioButton
          buttonColor={props.sendButtonColor}
          type="button"
          class="m-0 start-recording-button h-14 flex items-center justify-center"
          isDisabled={props.disabled}
          on:click={props.onMicrophoneClicked}
        >
          <span style={{ 'font-family': 'Poppins, sans-serif' }}>Record Audio</span>
        </RecordAudioButton>
      ) : null}
      <SendButton
        sendButtonColor={props.sendButtonColor}
        type="button"
        isDisabled={props.disabled || inputValue() === ''}
        class="m-0 h-14 flex items-center justify-center"
        on:click={submit}
      >
        <span style={{ 'font-family': 'Poppins, sans-serif' }}>Send</span>
      </SendButton>
    </div>
  );
};
