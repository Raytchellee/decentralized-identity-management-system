import { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';

interface PushDropdownProp {
    label?: string;
    placeholder?: string;
    data?: string[];
    value?: string;
    onChange?: (val: string) => any;
    searchable?: boolean;
}

interface CustomRef {
    dropdown: HTMLDivElement | null;
    searchInput: HTMLInputElement | null;
}

export const PushDropdown = ({
    label = '',
    placeholder = 'Select',
    data = [],
    value = '',
    onChange = () => null,
    searchable = false,
}: PushDropdownProp) => {
    const [isOpen, setIsOpen] = useState(false);
    const [justOpened, setJustOpened] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [options, setOptions] = useState<string[]>(data);

    const [selectedRowId, setSelectedRowId] = useState('');

    const randomKey = '9080495';

    const ref = useRef<CustomRef>({
        dropdown: null,
        searchInput: null,
    });

    const toggle = () => {
        setJustOpened(false);
        setIsOpen(!isOpen);
    };

    const getDropdownClassName = () => {
        let className = '';

        if (data.length === 1) {
            className = isOpen ? styles.openAnimation1 : styles.closeAnimation1;
        } else if (data.length === 2) {
            className = isOpen ? styles.openAnimation2 : styles.closeAnimation2;
        } else if (data.length === 3) {
            className = isOpen ? styles.openAnimation3 : styles.closeAnimation3;
        } else if (data.length === 4) {
            className = isOpen ? styles.openAnimation4 : styles.closeAnimation4;
        } else if (data.length >= 5) {
            className = isOpen ? styles.openAnimation : styles.closeAnimation;
        } else {
            className = '';
        }

        return className;
    };

    const scrollToSelected = () => {
        const row = document.getElementById(selectedRowId);

        if (!row) return;

        const rowHeight = row.getClientRects()['0']?.height || 0;

        const indexOfSelected = data.indexOf(value);

        if (isNaN(indexOfSelected)) return;

        setTimeout(() => {
            const distance = rowHeight * indexOfSelected;

            const { dropdown } = ref.current;

            dropdown?.scrollTo({
                top: distance,
                left: 0,
                behavior: 'smooth',
            });
        }, 500);
    };

    useEffect(() => {
        if (isOpen) {
            scrollToSelected();

            if (searchable) {
                const { searchInput } = ref.current;
                searchInput?.focus();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchable && searchText !== value) {
            const filteredData = data.filter((val) => {
                return val.toLowerCase().includes(searchText.toLowerCase());
            });

            setOptions(filteredData);
        } else if (
            searchable &&
            searchText.toLowerCase() === value.toLowerCase()
        ) {
            setOptions(data);

            setTimeout(() => {
                scrollToSelected();
            }, 500);
        }
    }, [searchText]);

    useEffect(() => {
        setSearchText(value);
    }, [value]);

    return (
        <div className={styles.input}>
            {label.length > 0 && <div className={styles.label}>{label}</div>}

            <div className={styles.inputWrapper} onClick={toggle}>
                <input
                    ref={(element) => {
                        ref.current.searchInput = element;
                    }}
                    className={classNames(
                        styles.searchInput,
                        !isOpen || !searchable ? styles.hide : '',
                    )}
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />

                {isOpen && searchable ? (
                    <></>
                ) : (
                    <>
                        {value.length > 0 ? (
                            <div className={styles.value}>{value}</div>
                        ) : (
                            <div className={styles.placeholder}>
                                {placeholder}
                            </div>
                        )}
                    </>
                )}

                {isOpen ? (
                    <MdOutlineKeyboardArrowUp
                        className={styles.icon}
                        size={20}
                        onClick={toggle}
                    />
                ) : (
                    <MdOutlineKeyboardArrowDown
                        className={styles.icon}
                        size={20}
                        color="#667085"
                        onClick={toggle}
                    />
                )}
            </div>

            <div
                ref={(element) => {
                    ref.current.dropdown = element;
                }}
                className={classNames(
                    styles.dropdown,
                    justOpened ? '' : getDropdownClassName(),
                )}
            >
                {options.map((current) => {
                    const randomId = randomKey + '-' + current.toLowerCase();
                    return (
                        <div
                            id={randomId}
                            key={randomId}
                            className={classNames(
                                styles.row,
                                current === value ? styles.selected : '',
                            )}
                            onClick={() => {
                                onChange(current);
                                toggle();
                                setSelectedRowId(randomId);
                            }}
                        >
                            <div className={styles.text}>{current}</div>

                            {current === value && (
                                <AiOutlineCheck color="#0D3DDC" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
