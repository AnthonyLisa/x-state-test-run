
import React from 'react';
import { setup, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import styles from './Test.module.scss';

interface ExampleFlowContext {
    gender: 'male' | 'female' | null;
}

type ExampleFlowEvent =
    | { type: 'SELECT_GENDER'; gender: 'male' | 'female' }
    | { type: "next.male" | "next.female" };


const exampleMachine = setup({
    types: {
        context: {} as ExampleFlowContext,
        events: {} as ExampleFlowEvent,

    },
    actions: {
        assign: assign,


    }
}).createMachine({
    id: 'exampleFlow',
    initial: 'step1',
    context: {
        gender: null,
    },
    states: {
        step1: {
            on: {
                SELECT_GENDER: {
                    actions: assign({
                        gender: (context) => {
                            const { event } = context;
                            return event.gender;
                        }
                    }),

                },
                "next.male": {
                    target: "step2",
                },
                "next.female": {
                    target: "step3",
                }
            },

        },
        step2: {
            on: {
                "next.*": {
                    target: "step3",
                }
            }
        },
        step3: {
            type: 'final',
        },
    },
});

const Header: React.FC<{ title: string }> = ({ title }) => (
    <header className={styles.header}>{title}</header>
);

const Footer: React.FC<{ onNext: () => void }> = ({ onNext }) => (
    <footer className={styles.footer}>
        <button onClick={onNext}>Next</button>
    </footer>
);

const Step1: React.FC<{ onSelectGender: (gender: 'male' | 'female') => void }> = ({
    onSelectGender,
}) => (
    <div className={styles.step}>
        <h2>What was your sex at birth?</h2>
        <label>
            <input
                type="radio"
                name="gender"
                value="male"
                onChange={() => onSelectGender('male')}
            />
            Male
        </label>
        <label>
            <input
                type="radio"
                name="gender"
                value="female"
                onChange={() => onSelectGender('female')}
            />
            Female
        </label>
    </div>
);

const Step2: React.FC = () => (
    <div className={`${styles.step} ${styles.blueBackground}`}>
        <p>Nice to meet you!</p>
    </div>
);

const Step3: React.FC = () => (
    <div className={`${styles.step} ${styles.redBackground}`}>
        <p>Pleased to meet you!</p>
    </div>
);

const ExampleFlow: React.FC = () => {
    const [state, send] = useMachine(exampleMachine);


    const renderStep = () => {
        switch (state.value) {
            case 'step1':
                return <Step1 onSelectGender={(gender) => send({ type: 'SELECT_GENDER', gender })} />;
            case 'step2':
                return <Step2 />;
            case 'step3':
                return <Step3 />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.exampleFlow}>
            <Header title="Example Flow" />
            <main className={styles.content}>{renderStep()}</main>
            <Footer onNext={() => state.context.gender ? send({ type: `next.${state.context.gender}` }) : null} />
        </div>
    );
};


export default ExampleFlow
