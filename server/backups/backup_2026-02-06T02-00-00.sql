--
-- PostgreSQL database dump
--

\restrict rUsRuJR6lpkDbPq6E9Gi7TO4JHDPgr0KE0geFScUgbsrj3CpzGL4MoYBWOZJDl1

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analysts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analysts (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.analysts OWNER TO postgres;

--
-- Name: analysts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analysts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analysts_id_seq OWNER TO postgres;

--
-- Name: analysts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analysts_id_seq OWNED BY public.analysts.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    sigla character varying(50),
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id integer NOT NULL,
    contract_number character varying(50),
    object text,
    company_name character varying(255),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    total_value numeric(15,2),
    current_balance numeric(15,2),
    status character varying(50) DEFAULT 'active'::character varying,
    analista_responsavel character varying(255),
    cliente character varying(255),
    grupo_cliente character varying(255),
    contrato character varying(100),
    termo character varying(100),
    status_vencimento character varying(50),
    data_inicio_efetividade timestamp without time zone,
    data_fim_efetividade timestamp without time zone,
    data_limite_andamento timestamp without time zone,
    valor_contrato numeric(15,2),
    valor_faturado numeric(15,2),
    valor_cancelado numeric(15,2),
    valor_a_faturar numeric(15,2),
    valor_novo_contrato numeric(15,2),
    tipo_tratativa character varying(100),
    tipo_aditamento character varying(100),
    etapa text,
    objeto text,
    secao_responsavel character varying(100),
    observacao text,
    numero_processo_sei_nosso character varying(100),
    numero_processo_sei_cliente character varying(100),
    contrato_cliente character varying(100),
    contrato_anterior character varying(100),
    numero_pnpp_crm character varying(100),
    sei character varying(100),
    contrato_novo character varying(100),
    termo_novo character varying(100),
    created_by character varying(255),
    client_name character varying(255),
    responsible_analyst character varying(255),
    pd_number character varying(50),
    sei_process_number character varying(50),
    sei_send_area character varying(100),
    esps jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contracts_id_seq OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: cycles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cycles (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE public.cycles OWNER TO postgres;

--
-- Name: cycles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cycles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cycles_id_seq OWNER TO postgres;

--
-- Name: cycles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cycles_id_seq OWNED BY public.cycles.id;


--
-- Name: deadline_contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deadline_contracts (
    id integer NOT NULL,
    analista_responsavel character varying(255),
    cliente character varying(255),
    grupo_cliente character varying(255),
    contrato character varying(255),
    termo character varying(255),
    status character varying(50) DEFAULT 'Ativo'::character varying,
    status_vencimento character varying(50),
    data_inicio_efetividade timestamp without time zone,
    data_fim_efetividade timestamp without time zone,
    data_limite_andamento timestamp without time zone,
    valor_contrato numeric(15,2),
    valor_faturado numeric(15,2),
    valor_cancelado numeric(15,2),
    valor_a_faturar numeric(15,2),
    valor_novo_contrato numeric(15,2),
    objeto text,
    tipo_tratativa character varying(255),
    tipo_aditamento character varying(255),
    etapa text,
    secao_responsavel character varying(255),
    observacao text,
    numero_processo_sei_nosso character varying(255),
    numero_processo_sei_cliente character varying(255),
    contrato_cliente character varying(255),
    contrato_anterior character varying(255),
    numero_pnpp_crm character varying(255),
    sei character varying(255),
    contrato_novo character varying(255),
    termo_novo character varying(255),
    created_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.deadline_contracts OWNER TO postgres;

--
-- Name: deadline_contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deadline_contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deadline_contracts_id_seq OWNER TO postgres;

--
-- Name: deadline_contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deadline_contracts_id_seq OWNED BY public.deadline_contracts.id;


--
-- Name: demands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demands (
    id integer NOT NULL,
    product character varying(255),
    demand_number character varying(50),
    status character varying(50),
    artifact character varying(255),
    complexity character varying(50),
    weight integer,
    client_id integer,
    analyst_id integer,
    cycle_id integer,
    requester_id integer,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    qualification_date timestamp without time zone,
    expected_delivery_date timestamp without time zone,
    delivery_date timestamp without time zone,
    observation text,
    frozen_time_minutes integer DEFAULT 0,
    last_frozen_at timestamp without time zone,
    support_analyst_id integer,
    delivery_date_change_reason text,
    contract_id integer
);


ALTER TABLE public.demands OWNER TO postgres;

--
-- Name: demands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.demands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.demands_id_seq OWNER TO postgres;

--
-- Name: demands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.demands_id_seq OWNED BY public.demands.id;


--
-- Name: finance_contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_contracts (
    id integer NOT NULL,
    client_name character varying(255) NOT NULL,
    pd_number character varying(50) NOT NULL,
    responsible_analyst character varying(255),
    sei_process_number character varying(50),
    sei_send_area character varying(100),
    esps jsonb DEFAULT '[]'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.finance_contracts OWNER TO postgres;

--
-- Name: finance_contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_contracts_id_seq OWNER TO postgres;

--
-- Name: finance_contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_contracts_id_seq OWNED BY public.finance_contracts.id;


--
-- Name: holidays; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.holidays (
    id integer NOT NULL,
    date timestamp without time zone,
    name character varying(255)
);


ALTER TABLE public.holidays OWNER TO postgres;

--
-- Name: holidays_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.holidays_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.holidays_id_seq OWNER TO postgres;

--
-- Name: holidays_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.holidays_id_seq OWNED BY public.holidays.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    contract_id integer,
    invoice_number character varying(50),
    amount numeric(15,2),
    issue_date timestamp without time zone,
    status character varying(50)
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: monthly_attestations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.monthly_attestations (
    id integer NOT NULL,
    contract_id integer,
    client_name character varying(255),
    pd_number character varying(50),
    responsible_analyst character varying(255),
    esp_number character varying(50),
    reference_month character varying(10),
    report_generation_date date,
    report_send_date date,
    attestation_return_date date,
    invoice_send_to_client_date date,
    invoice_number character varying(50),
    billed_amount numeric(15,2),
    paid_amount numeric(15,2),
    invoice_send_date date,
    observations text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sei_process_number character varying(50),
    sei_send_area character varying(100)
);


ALTER TABLE public.monthly_attestations OWNER TO postgres;

--
-- Name: monthly_attestations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.monthly_attestations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.monthly_attestations_id_seq OWNER TO postgres;

--
-- Name: monthly_attestations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.monthly_attestations_id_seq OWNED BY public.monthly_attestations.id;


--
-- Name: requesters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requesters (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255)
);


ALTER TABLE public.requesters OWNER TO postgres;

--
-- Name: requesters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requesters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requesters_id_seq OWNER TO postgres;

--
-- Name: requesters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requesters_id_seq OWNED BY public.requesters.id;


--
-- Name: status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status_history (
    id integer NOT NULL,
    demand_id integer,
    from_status character varying(50),
    to_status character varying(50),
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    time_in_previous_status_minutes integer,
    changed_by character varying(255)
);


ALTER TABLE public.status_history OWNER TO postgres;

--
-- Name: status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.status_history_id_seq OWNER TO postgres;

--
-- Name: status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.status_history_id_seq OWNED BY public.status_history.id;


--
-- Name: termos_confirmacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.termos_confirmacao (
    id integer NOT NULL,
    numero_tc character varying(50),
    contrato_associado_pd character varying(50),
    numero_processo character varying(50),
    data_inicio_vigencia timestamp without time zone,
    data_fim_vigencia timestamp without time zone,
    valor_total numeric(15,2),
    objeto text,
    area_demandante character varying(100),
    fiscal_contrato character varying(255),
    gestor_contrato character varying(255),
    created_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);


ALTER TABLE public.termos_confirmacao OWNER TO postgres;

--
-- Name: termos_confirmacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.termos_confirmacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.termos_confirmacao_id_seq OWNER TO postgres;

--
-- Name: termos_confirmacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.termos_confirmacao_id_seq OWNED BY public.termos_confirmacao.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    password character varying(255),
    role character varying(50),
    department character varying(50),
    allowed_modules text[] DEFAULT '{flow}'::text[],
    profile_type character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analysts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysts ALTER COLUMN id SET DEFAULT nextval('public.analysts_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: cycles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycles ALTER COLUMN id SET DEFAULT nextval('public.cycles_id_seq'::regclass);


--
-- Name: deadline_contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deadline_contracts ALTER COLUMN id SET DEFAULT nextval('public.deadline_contracts_id_seq'::regclass);


--
-- Name: demands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demands ALTER COLUMN id SET DEFAULT nextval('public.demands_id_seq'::regclass);


--
-- Name: finance_contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_contracts ALTER COLUMN id SET DEFAULT nextval('public.finance_contracts_id_seq'::regclass);


--
-- Name: holidays id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holidays ALTER COLUMN id SET DEFAULT nextval('public.holidays_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: monthly_attestations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_attestations ALTER COLUMN id SET DEFAULT nextval('public.monthly_attestations_id_seq'::regclass);


--
-- Name: requesters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requesters ALTER COLUMN id SET DEFAULT nextval('public.requesters_id_seq'::regclass);


--
-- Name: status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history ALTER COLUMN id SET DEFAULT nextval('public.status_history_id_seq'::regclass);


--
-- Name: termos_confirmacao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termos_confirmacao ALTER COLUMN id SET DEFAULT nextval('public.termos_confirmacao_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: analysts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analysts (id, name, email, created_at) FROM stdin;
3	Analista Real	real@fluxo.com	2026-02-03 14:57:13.601
4	ADAIR LINO	adair@fluxo.com	2026-02-03 14:57:13.601
5	AQUILA MACHADO LIMA	aquila@sp.gov.br	2026-02-03 14:57:13.601
6	JAIR BARRETO DE VASCONCELOS	jvasconcelos@sp.gov.br	2026-02-03 14:57:13.601
2	SAMUEL DIAS	samuel@fluxo.com	2026-02-03 14:57:13.601
1	Ana Respons??vel	responsavel@fluxo.com	2026-02-03 14:57:13.601
7	Analista COCR	analista_cocr@fluxo.com	2026-02-03 14:57:14.521
8	Analista CDPC	analista_cdpc@fluxo.com	2026-02-04 14:23:26.784
9	Analista CVAC	analista_cvac@fluxo.com	2026-02-04 14:23:26.838
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, name, sigla, active, created_at) FROM stdin;
1	SGGD	\N	t	2026-02-03 14:57:13.601
2	DESENVOLVE	\N	t	2026-02-03 14:57:13.601
3	CONSELHO DE ARQUITETURA E URBANISMO DO BRASIL	\N	t	2026-02-03 15:21:00.193
4	FUNDO MUNICIPAL DE TRANSITO - FUMTRAN	\N	t	2026-02-03 15:21:00.203
5	CAMARA MUNICIPAL DE GUARULHOS	\N	t	2026-02-03 15:21:00.209
6	PREF. MUN. - SAO VICENTE	\N	t	2026-02-03 15:21:00.217
7	MUNICIPIO DE CANDIDO MOTA	\N	t	2026-02-03 15:21:00.223
8	MUNICIPIO DE TABOAO DA SERRA	\N	t	2026-02-03 15:21:00.228
9	MUNICIPIO DE MOCOCA	\N	t	2026-02-03 15:21:00.234
10	MUNICIPIO DE JALES	\N	t	2026-02-03 15:21:00.245
11	MUNICIPIO DE PILAR DO SUL	\N	t	2026-02-03 15:21:00.256
12	MUNICIPIO DE PEDREGULHO	\N	t	2026-02-03 15:21:00.262
13	CIA DO METROPOLITANO DE SAO PAULO	\N	t	2026-02-03 15:21:00.271
14	EMPRESA MUNICIPAL DE MOBILIDADE URBANA DE MARILIA - EMDURB	\N	t	2026-02-03 15:21:00.277
15	MUNICIPIO DE FRANCISCO MORATO	\N	t	2026-02-03 15:21:00.283
16	MUNICIPIO DE PRAIA GRANDE	\N	t	2026-02-03 15:21:00.29
17	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	\N	t	2026-02-03 15:21:00.304
18	MUNICIPIO DE PANORAMA	\N	t	2026-02-03 15:21:00.311
19	MUNICIPIO DE ARTUR NOGUEIRA	\N	t	2026-02-03 15:21:00.317
20	FUNDACAO CARLOS ALBERTO VANZOLINI	\N	t	2026-02-03 15:21:00.323
21	IMPRENSA OFICIAL DO ESTADO DO RIO DE JANEIRO	\N	t	2026-02-03 15:21:00.329
22	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	\N	t	2026-02-03 15:21:00.335
23	MUNICIPIO DE GUAIRA	\N	t	2026-02-03 15:21:00.34
24	MUNICIPIO DE PENAPOLIS	\N	t	2026-02-03 15:21:00.347
25	SAO PAULO PREVIDENCIA - SPPREV	\N	t	2026-02-03 15:21:00.353
26	MUNICIPIO DE PARANAPANEMA	\N	t	2026-02-03 15:21:00.36
27	MUNICIPIO DE ANGATUBA	\N	t	2026-02-03 15:21:00.367
28	PROGRESSO E DESENVOL MUNICIPAL-OLIMPIA	\N	t	2026-02-03 15:21:00.373
29	MUNICIPIO DE APIAI	\N	t	2026-02-03 15:21:00.381
30	SECRETARIA MUNICIPAL DE EDUCACAO	\N	t	2026-02-03 15:21:00.389
31	MUNICIPIO DE ITAPORANGA	\N	t	2026-02-03 15:21:00.396
32	MUNICIPIO DE VOTORANTIM	\N	t	2026-02-03 15:21:00.406
33	MUNICIPIO DE ITAPECERICA DA SERRA	\N	t	2026-02-03 15:21:00.412
34	MUNICIPIO DE GUARULHOS	\N	t	2026-02-03 15:21:00.418
35	MUNICIPIO DE SANTA ISABEL	\N	t	2026-02-03 15:21:00.426
36	MUNICIPIO DE ATIBAIA	\N	t	2026-02-03 15:21:00.433
38	MUNICIPIO DE COLINA	\N	t	2026-02-03 15:21:00.445
39	MUNICIPIO DE MONTE ALTO	\N	t	2026-02-03 15:21:00.453
40	PREFEITURA MUNICIPAL DE QUATA	\N	t	2026-02-03 15:21:00.459
41	MUNICIPIO DE AVARE	\N	t	2026-02-03 15:21:00.465
42	MUNICIPIO DE ITABERA	\N	t	2026-02-03 15:21:00.471
43	MUNICIPIO DE ARACOIABA DA SERRA	\N	t	2026-02-03 15:21:00.477
44	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:00.483
45	MUNICIPIO DE CARAGUATATUBA	\N	t	2026-02-03 15:21:00.494
46	SECRETARIA DA FAZENDA E PLANEJAMENTO	\N	t	2026-02-03 15:21:00.5
47	MUNICIPIO DE SAO MIGUEL ARCANJO	\N	t	2026-02-03 15:21:00.506
48	MUNICIPIO DE BRAGANCA PAULISTA	\N	t	2026-02-03 15:21:00.512
49	MUNICIPIO DE TABAPUA	\N	t	2026-02-03 15:21:00.519
50	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A	\N	t	2026-02-03 15:21:00.524
51	MUNICIPIO DE PIRACAIA	\N	t	2026-02-03 15:21:00.529
52	MUNICIPIO DE GUARUJA	\N	t	2026-02-03 15:21:00.534
53	MUNICIPIO DE TAQUARITUBA	\N	t	2026-02-03 15:21:00.539
54	INSTITUTO DE PESOS E MEDIDAS DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:00.544
55	MUNICIPIO DE SAO SIMAO	\N	t	2026-02-03 15:21:00.549
56	MUNICIPIO DE GUARIBA	\N	t	2026-02-03 15:21:00.554
57	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	\N	t	2026-02-03 15:21:00.559
58	MUNICIPIO DE CONCHAL	\N	t	2026-02-03 15:21:00.565
59	BANCO RENDIMENTO S.A.	\N	t	2026-02-03 15:21:00.572
60	MUNICIPIO DE ITATIBA	\N	t	2026-02-03 15:21:00.578
61	FUNDO SOCIAL DE SAO PAULO - FUSSP	\N	t	2026-02-03 15:21:00.586
62	MUNICIPIO DE AGUAS DE SAO PEDRO	\N	t	2026-02-03 15:21:00.592
63	MUNICIPIO DE BIRITIBA-MIRIM	\N	t	2026-02-03 15:21:00.61
64	PREFEITURA DE SANTA BRANCA	\N	t	2026-02-03 15:21:00.623
65	SAO PAULO TRIBUNAL DE JUSTICA	\N	t	2026-02-03 15:21:00.629
66	MUNICIPIO DE ORLANDIA	\N	t	2026-02-03 15:21:00.636
67	MUNICIPIO DE SOCORRO	\N	t	2026-02-03 15:21:00.646
68	MUNICIPIO DE MOGI-MIRIM	\N	t	2026-02-03 15:21:00.655
69	SECRETARIA DE GESTAO E GOVERNO DIGITAL	\N	t	2026-02-03 15:21:00.66
70	FUNDACAO CONSERV PROD FLORESTAL EST SP	\N	t	2026-02-03 15:21:00.666
71	MUNICIPIO DE JANDIRA	\N	t	2026-02-03 15:21:00.676
72	MUNICIPIO DE INDAIATUBA	\N	t	2026-02-03 15:21:00.682
73	MUNICIPIO DE ITAQUAQUECETUBA	\N	t	2026-02-03 15:21:00.689
74	MUNICIPIO DE CONCHAS	\N	t	2026-02-03 15:21:00.696
75	AGENCIA METROPOLITANA DE CAMPINAS - AGEMCAMP	\N	t	2026-02-03 15:21:00.701
76	MUNICIPIO DE HORTOLANDIA	\N	t	2026-02-03 15:21:00.707
77	MUNICIPIO DE SEVERINIA	\N	t	2026-02-03 15:21:00.716
78	MUNICIPIO DE LIMEIRA	\N	t	2026-02-03 15:21:00.723
79	MUNICIPIO DE CAIEIRAS	\N	t	2026-02-03 15:21:00.731
80	MUNICIPIO DE SANTO ANDRE	\N	t	2026-02-03 15:21:00.736
81	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:00.744
82	MUNICIPIO DE SUMARE	\N	t	2026-02-03 15:21:00.75
83	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	\N	t	2026-02-03 15:21:00.756
84	SECRETARIA DE ESTADO DA SAUDE	\N	t	2026-02-03 15:21:00.761
85	MUNICIPIO DE ITUPEVA	\N	t	2026-02-03 15:21:00.767
86	MUNICIPIO DE FERRAZ DE VASCONCELOS	\N	t	2026-02-03 15:21:00.772
87	SERVICO MUNICIPAL DE AGUA E ESGOTO	\N	t	2026-02-03 15:21:00.777
88	COMPANHIA MUNICIPAL DE TRANSITO -CMT	\N	t	2026-02-03 15:21:00.782
89	MUNICIPIO DE LOUVEIRA	\N	t	2026-02-03 15:21:00.788
90	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:00.793
91	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:00.798
92	MUNICIPIO DE IGUAPE	\N	t	2026-02-03 15:21:00.804
93	SECRETARIA DE TURISMO E VIAGENS	\N	t	2026-02-03 15:21:00.809
94	MUNICIPIO DE PINDAMONHANGABA	\N	t	2026-02-03 15:21:00.814
95	MUNICIPIO DE BASTOS	\N	t	2026-02-03 15:21:00.82
96	MUNICIPIO DE CANAS	\N	t	2026-02-03 15:21:00.825
97	MUNICIPIO DE POTIM	\N	t	2026-02-03 15:21:00.831
98	SECRETARIA DA JUSTICA E DA DEFESA DA CIDADANIA	\N	t	2026-02-03 15:21:00.836
99	MUNICIPIO DE ELDORADO	\N	t	2026-02-03 15:21:00.84
100	POLICIA CIVIL DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:00.845
101	MUNICIPIO DE CASA BRANCA	\N	t	2026-02-03 15:21:00.851
102	MUNICIPIO DE RANCHARIA	\N	t	2026-02-03 15:21:00.856
103	MUNICIPIO DE IGARAPAVA	\N	t	2026-02-03 15:21:00.861
104	MUNICIPIO DE PEREIRA BARRETO	\N	t	2026-02-03 15:21:00.866
105	CAMARA MUNICIPAL DE CUBATAO	\N	t	2026-02-03 15:21:00.87
106	COLEGIO BANDEIRANTES LTDA	\N	t	2026-02-03 15:21:00.875
107	CASA MILITAR DO GABINETE DO GOVERNADOR	\N	t	2026-02-03 15:21:00.88
108	MUNICIPIO DE PITANGUEIRAS	\N	t	2026-02-03 15:21:00.885
109	MUNICIPIO DE MAUA	\N	t	2026-02-03 15:21:00.89
110	MUNICIPIO DE PARAGUACU PAULISTA	\N	t	2026-02-03 15:21:00.895
111	MUNICIPIO DE CERQUEIRA CESAR	\N	t	2026-02-03 15:21:00.899
112	MUNICIPIO DE ITAPIRA	\N	t	2026-02-03 15:21:00.904
113	MUNICIPIO DA ESTANCIA TURISTICA DE IBITINGA	\N	t	2026-02-03 15:21:00.909
114	MUNICIPIO DE SALESOPOLIS	\N	t	2026-02-03 15:21:00.914
115	MUNICIPIO DE SALTO	\N	t	2026-02-03 15:21:00.918
116	MUNICIPIO DE NOVO HORIZONTE	\N	t	2026-02-03 15:21:00.923
117	MUNICIPIO DE MIRACATU	\N	t	2026-02-03 15:21:00.929
118	MUNICIPIO DE IBATE	\N	t	2026-02-03 15:21:00.934
119	MUNICIPIO DE PIRAJU	\N	t	2026-02-03 15:21:00.939
120	MUNICIPIO DE TUPA	\N	t	2026-02-03 15:21:00.943
121	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	\N	t	2026-02-03 15:21:00.949
122	MUNICIPIO DE GARCA	\N	t	2026-02-03 15:21:00.954
123	MUNICIPIO DE SAO PEDRO	\N	t	2026-02-03 15:21:00.959
124	MUNICIPIO DE AMERICANA	\N	t	2026-02-03 15:21:00.964
125	MUNICIPIO DE PEDREIRA	\N	t	2026-02-03 15:21:00.969
126	MUNICIPIO DE UBATUBA	\N	t	2026-02-03 15:21:00.973
127	DEPARTAMENTO DE ESTRADAS DE RODAGEM	\N	t	2026-02-03 15:21:00.981
128	MUNICIPIO DE NOVA ODESSA	\N	t	2026-02-03 15:21:00.986
129	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	\N	t	2026-02-03 15:21:00.99
130	AGENCIA SAO PAULO DE DESENVOLVIMENTO - ADE SAMPA	\N	t	2026-02-03 15:21:00.996
131	MUNICIPIO DE SANTA RITA DO PASSA QUATRO	\N	t	2026-02-03 15:21:01.003
132	MUNICIPIO DE TARUMA	\N	t	2026-02-03 15:21:01.009
133	MUNICIPIO DE MOGI DAS CRUZES	\N	t	2026-02-03 15:21:01.015
134	SECRETARIA DE MEIO AMBIENTE INFRAESTRUTURA E LOGISTICA	\N	t	2026-02-03 15:21:01.02
135	SECRETARIA DE POLITICAS PARA A MULHER	\N	t	2026-02-03 15:21:01.025
136	MUNICIPIO DE SAO CARLOS	\N	t	2026-02-03 15:21:01.031
137	INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO - IPT	\N	t	2026-02-03 15:21:01.037
138	MUNICIPIO DE BEBEDOURO	\N	t	2026-02-03 15:21:01.042
139	MUNICIPIO DE LINDOIA	\N	t	2026-02-03 15:21:01.048
140	SECRETARIA DE DESENVOLVIMENTO SOCIAL	\N	t	2026-02-03 15:21:01.054
141	MUNICIPIO DE ITAPEVI	\N	t	2026-02-03 15:21:01.059
142	CODERP CIA DE DESENVOLVIMENTO ECONOMICO DE RIB PRETO	\N	t	2026-02-03 15:21:01.064
143	BANCO  DAYCOVAL S.A.	\N	t	2026-02-03 15:21:01.068
144	MUNICIPIO DE CAJURU	\N	t	2026-02-03 15:21:01.073
145	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	\N	t	2026-02-03 15:21:01.077
146	MUNICIPIO DE BRODOWSK	\N	t	2026-02-03 15:21:01.082
147	MUNICIPIO DE SAO JOSE DO RIO PARDO	\N	t	2026-02-03 15:21:01.087
148	MUNICIPIO DE PRESIDENTE EPITACIO	\N	t	2026-02-03 15:21:01.091
149	MUNICIPIO DE IPERO	\N	t	2026-02-03 15:21:01.096
150	MUNICIPIO DE PRESIDENTE VENCESLAU	\N	t	2026-02-03 15:21:01.101
151	SECRETARIA DE ESPORTES	\N	t	2026-02-03 15:21:01.106
152	SP CASA CIVIL	\N	t	2026-02-03 15:21:01.112
153	MUNICIPIO DE MONGAGUA	\N	t	2026-02-03 15:21:01.117
154	MUNICIPIO DE CARAPICUIBA	\N	t	2026-02-03 15:21:01.125
155	MUNICIPIO DE POTIRENDABA	\N	t	2026-02-03 15:21:01.13
156	MUNICIPIO DE LARANJAL PAULISTA	\N	t	2026-02-03 15:21:01.136
157	MUNICIPIO DE IPUA	\N	t	2026-02-03 15:21:01.141
158	MUNICIPIO DE VARZEA PAULISTA	\N	t	2026-02-03 15:21:01.146
159	MUNICIPIO DE RIFAINA	\N	t	2026-02-03 15:21:01.151
160	MUNICIPIO DE JUNDIAI	\N	t	2026-02-03 15:21:01.155
161	INCLOUD TECNOLOGIA E SERVICOS LTDA	\N	t	2026-02-03 15:21:01.16
162	MUNICIPIO DE CERQUILHO	\N	t	2026-02-03 15:21:01.166
163	MUNICIPIO DE CAPAO BONITO	\N	t	2026-02-03 15:21:01.172
164	ASSEMBLEIA LEGISLATIVA DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.176
165	MUNICIPIO DE SANTO ANTONIO DO PINHAL	\N	t	2026-02-03 15:21:01.181
166	PROCURADORIA GERAL DO ESTADO	\N	t	2026-02-03 15:21:01.186
167	MUNICIPIO DE RIO DAS PEDRAS	\N	t	2026-02-03 15:21:01.194
168	UNIVERSIDADE ESTADUAL PAULISTA JULIO DE MESQUITA FILHO	\N	t	2026-02-03 15:21:01.199
169	MUNICIPIO DE JARDINOPOLIS	\N	t	2026-02-03 15:21:01.204
170	MUNICIPIO DE JUQUITIBA	\N	t	2026-02-03 15:21:01.21
171	FUND PE ANCHIETA CENTRO PAULISTA RADIO E TV EDUCATIVAS	\N	t	2026-02-03 15:21:01.215
172	MUNICIPIO DE ESPIRITO SANTO DO PINHAL	\N	t	2026-02-03 15:21:01.22
173	MUNICIPIO DE FLORIDA PAULISTA	\N	t	2026-02-03 15:21:01.225
174	SECRETARIA MUNICIPAL DA PESSOA COM DEFICIENCIA	\N	t	2026-02-03 15:21:01.23
175	TRILOGIC TECNOLOGIA LTDA	\N	t	2026-02-03 15:21:01.235
176	MUNICIPIO DE CAMPO LIMPO PAULISTA	\N	t	2026-02-03 15:21:01.24
177	MUNICIPIO DE DOIS CORREGOS	\N	t	2026-02-03 15:21:01.245
178	BANCO CITIBANK S.A.	\N	t	2026-02-03 15:21:01.249
179	FUNDACAO DE AMPARO E PESQUISA DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.254
180	SUPERINTENDENCIA DA POLICIA TECNICO-CIENTIFICA	\N	t	2026-02-03 15:21:01.258
181	MUNICIPIO DE TANABI	\N	t	2026-02-03 15:21:01.262
182	MUNICIPIO DE CESARIO LANGE	\N	t	2026-02-03 15:21:01.267
183	MUNICIPIO DE SAO ROQUE	\N	t	2026-02-03 15:21:01.272
184	MUNICIPIO DE EMBU DAS ARTES	\N	t	2026-02-03 15:21:01.276
185	MUNICIPIO DE ITAPEVA	\N	t	2026-02-03 15:21:01.28
186	SECRETARIA MUNICIPAL DE GESTAO - SMG	\N	t	2026-02-03 15:21:01.285
187	MUNICIPIO DE GUARA	\N	t	2026-02-03 15:21:01.29
188	MUNICIPIO DE ALUMINIO	\N	t	2026-02-03 15:21:01.294
189	MUNICIPIO DE ITATINGA	\N	t	2026-02-03 15:21:01.299
190	MUNICIPIO DE SAO LUIZ DO PARAITINGA	\N	t	2026-02-03 15:21:01.306
191	PREFEITURA MUNICIPAL DA ESTANCIA TURISTICA DE RIBEIRAO PIRES	\N	t	2026-02-03 15:21:01.31
192	MUNICIPIO DE POA	\N	t	2026-02-03 15:21:01.315
193	MUNICIPIO DE SERRA NEGRA	\N	t	2026-02-03 15:21:01.32
194	MUNICIPIO DE NATIVIDADE DA SERRA	\N	t	2026-02-03 15:21:01.325
195	AGENCIA METROPOLITANA DA BAIXADA SANTISTA - AGEM	\N	t	2026-02-03 15:21:01.331
196	CORPO DE BOMBEIROS DA POLICIA MILITAR DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.337
197	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	\N	t	2026-02-03 15:21:01.341
198	MUNICIPIO DE LINS	\N	t	2026-02-03 15:21:01.345
199	MUNICIPIO DE OSVALDO CRUZ	\N	t	2026-02-03 15:21:01.35
200	MUNICIPIO DE ROSANA	\N	t	2026-02-03 15:21:01.356
201	MUNICIPIO DE MIRASSOL	\N	t	2026-02-03 15:21:01.36
202	MUNICIPIO DE AMPARO	\N	t	2026-02-03 15:21:01.365
203	FUNDO ESPECIAL DE DESPESA DO MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.371
204	SAO PAULO SECRETARIA DA EDUCACAO	\N	t	2026-02-03 15:21:01.376
205	MUNICIPIO DE LUIZ ANTONIO	\N	t	2026-02-03 15:21:01.381
206	MUNICIPIO DE PORTO FERREIRA	\N	t	2026-02-03 15:21:01.386
207	MUNICIPIO DE JARINU	\N	t	2026-02-03 15:21:01.392
208	MUNICIPIO DE SAO LOURENCO DA SERRA	\N	t	2026-02-03 15:21:01.396
209	MUNICIPIO DE ALTINOPOLIS	\N	t	2026-02-03 15:21:01.402
210	MUNICIPIO DE VALINHOS	\N	t	2026-02-03 15:21:01.406
211	MUNICIPIO DE BURI	\N	t	2026-02-03 15:21:01.411
212	C E C M DOS TRAB.DA CIA PROC.DADOS EST.SP CREDIPRODESP	\N	t	2026-02-03 15:21:01.416
213	MUNICIPIO DE CRAVINHOS	\N	t	2026-02-03 15:21:01.424
214	MUNICIPIO DE COTIA	\N	t	2026-02-03 15:21:01.431
215	MUNICIPIO DE MONTE AZUL PAULISTA	\N	t	2026-02-03 15:21:01.437
216	MUNICIPIO DE SERRANA	\N	t	2026-02-03 15:21:01.441
217	IMPRENSA OFICIAL DE SERGIPE - IOSE	\N	t	2026-02-03 15:21:01.445
218	MUNICIPIO DE ARACARIGUAMA	\N	t	2026-02-03 15:21:01.45
219	MUNICIPIO DE REGISTRO	\N	t	2026-02-03 15:21:01.455
220	MUNICIPIO DE PROMISSAO	\N	t	2026-02-03 15:21:01.46
221	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	\N	t	2026-02-03 15:21:01.465
222	MUNICIPIO DE FRANCA	\N	t	2026-02-03 15:21:01.47
223	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	\N	t	2026-02-03 15:21:01.475
224	MUNICIPIO DE CAMPOS DO JORDAO	\N	t	2026-02-03 15:21:01.48
225	MUNICIPIO DE ARARAS	\N	t	2026-02-03 15:21:01.485
226	MUNICIPIO DE SANTA CRUZ DAS PALMEIRAS	\N	t	2026-02-03 15:21:01.489
227	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	\N	t	2026-02-03 15:21:01.493
228	COMPANHIA PAULISTA DE SECURITIZACAO	\N	t	2026-02-03 15:21:01.498
229	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE RPUSP	\N	t	2026-02-03 15:21:01.503
230	MUNICIPIO DE CACAPAVA	\N	t	2026-02-03 15:21:01.508
231	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	\N	t	2026-02-03 15:21:01.514
232	MUNICIPIO DE BOCAINA	\N	t	2026-02-03 15:21:01.518
233	MUNICIPIO DE JABOTICABAL	\N	t	2026-02-03 15:21:01.522
234	PREFEITURA MUNICIPAL DE FERNANDOPOLIS	\N	t	2026-02-03 15:21:01.527
235	MUNICIPIO DE HOLAMBRA	\N	t	2026-02-03 15:21:01.532
236	MUNICIPIO DE GUAREI	\N	t	2026-02-03 15:21:01.537
237	EMPRESA MUNICIPAL DE DESENVOLVIMENTO DE CAMPINAS S/A	\N	t	2026-02-03 15:21:01.542
238	MUNICIPIO DE IPIGUA	\N	t	2026-02-03 15:21:01.546
239	FACULDADE DE MEDICINA DE MARILIA	\N	t	2026-02-03 15:21:01.551
241	MUNICIPIO DE MORRO AGUDO	\N	t	2026-02-03 15:21:01.561
242	MUNICIPIO DE CAFELANDIA	\N	t	2026-02-03 15:21:01.565
243	MUNICIPIO DE CABREUVA	\N	t	2026-02-03 15:21:01.571
244	MUNICIPIO DE BOITUVA	\N	t	2026-02-03 15:21:01.576
245	MUNICIPIO DE BIRIGUI	\N	t	2026-02-03 15:21:01.581
246	MUNICIPIO DE ITAPETININGA	\N	t	2026-02-03 15:21:01.587
247	MUNICIPIO DE SANTA BARBARA D'OESTE	\N	t	2026-02-03 15:21:01.592
248	MUNICIPIO DE ARUJA	\N	t	2026-02-03 15:21:01.597
249	MUNICIPIO DE CAJAMAR	\N	t	2026-02-03 15:21:01.602
250	MUNICIPIO DE VARGEM GRANDE PAULISTA	\N	t	2026-02-03 15:21:01.61
251	COMPANHIA PAULISTA DE PARCERIAS - CPP	\N	t	2026-02-03 15:21:01.615
252	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	\N	t	2026-02-03 15:21:01.62
253	MUNICIPIO DE MIGUELOPOLIS	\N	t	2026-02-03 15:21:01.624
254	MUNICIPIO DE SANTA FE DO SUL	\N	t	2026-02-03 15:21:01.629
255	FUNDACAO ZERBINI	\N	t	2026-02-03 15:21:01.634
256	MUNICIPIO DE JUQUIA	\N	t	2026-02-03 15:21:01.639
257	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	\N	t	2026-02-03 15:21:01.643
258	MUNICIPIO DE PIRAPOZINHO	\N	t	2026-02-03 15:21:01.648
259	MUNICIPIO DE ARARAQUARA	\N	t	2026-02-03 15:21:01.653
260	MUNICIPIO DE SANTANA DE PARNAIBA	\N	t	2026-02-03 15:21:01.658
261	AGENCIA METROPOLITANA DO VALE DO PARAIBA E LITORAL NORTE - AGEMVALE	\N	t	2026-02-03 15:21:01.662
262	MUNICIPIO DE IRACEMAPOLIS	\N	t	2026-02-03 15:21:01.667
263	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	\N	t	2026-02-03 15:21:01.672
264	MUNICIPIO DE SANTA CRUZ DO RIO PARDO	\N	t	2026-02-03 15:21:01.677
265	MUNICIPIO  DE JACUPIRANGA	\N	t	2026-02-03 15:21:01.682
266	MUNICIPIO DE ANDRADINA	\N	t	2026-02-03 15:21:01.686
267	MUNICIPIO DE PIRAPORA DO BOM JESUS	\N	t	2026-02-03 15:21:01.691
268	MUNICIPIO DE OURINHOS	\N	t	2026-02-03 15:21:01.696
269	MUNICIPIO DE CAJATI	\N	t	2026-02-03 15:21:01.701
270	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	\N	t	2026-02-03 15:21:01.706
271	MUNICIPIO DE CATANDUVA	\N	t	2026-02-03 15:21:01.711
272	MUNICIPIO DE PRESIDENTE PRUDENTE	\N	t	2026-02-03 15:21:01.716
273	MUNICIPIO DE TATUI	\N	t	2026-02-03 15:21:01.721
274	MUNICIPIO DE FRANCO DA ROCHA	\N	t	2026-02-03 15:21:01.726
275	MUNICIPIO DE ASSIS	\N	t	2026-02-03 15:21:01.73
276	MUNICIPIO DE TEODORO SAMPAIO	\N	t	2026-02-03 15:21:01.735
277	FUNDACAO ONCOCENTRO DE SAO PAULO	\N	t	2026-02-03 15:21:01.74
278	SECRETARIA MUNICIPAL DAS SUBPREFEITURAS	\N	t	2026-02-03 15:21:01.744
279	FUNDACAO DE PREVIDENCIA COMPLEMENTAR DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.749
280	MUNICIPIO DE LENCOIS PAULISTA	\N	t	2026-02-03 15:21:01.754
281	SECRETARIA MUNICIPAL DE URBANISMO E LICENCIAMENTO	\N	t	2026-02-03 15:21:01.759
282	MUNICIPIO DE CAPELA DO ALTO	\N	t	2026-02-03 15:21:01.763
283	MUNICIPIO DE MONTE ALEGRE DO SUL	\N	t	2026-02-03 15:21:01.767
284	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	\N	t	2026-02-03 15:21:01.772
285	MUNICIPIO DE NAZARE PAULISTA	\N	t	2026-02-03 15:21:01.777
286	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	\N	t	2026-02-03 15:21:01.781
287	MUNICIPIO DE PIRASSUNUNGA	\N	t	2026-02-03 15:21:01.785
288	MUNICIPIO DE AGUAS DA PRATA	\N	t	2026-02-03 15:21:01.79
289	MUNICIPIO DE MAIRINQUE	\N	t	2026-02-03 15:21:01.795
290	MUNICIPIO DE CORDEIROPOLIS	\N	t	2026-02-03 15:21:01.8
291	MUNICIPIO DE MOGI-GUACU	\N	t	2026-02-03 15:21:01.804
292	MUNICIPIO DE BANANAL	\N	t	2026-02-03 15:21:01.809
293	MUNICIPIO DE BERTIOGA	\N	t	2026-02-03 15:21:01.813
294	UNIVERSIDADE DE SAO PAULO	\N	t	2026-02-03 15:21:01.818
295	MUNICIPIO DE PEDERNEIRAS	\N	t	2026-02-03 15:21:01.822
296	MUNICIPIO DE JAGUARIUNA	\N	t	2026-02-03 15:21:01.827
297	FUND PROF DR MANOEL PEDRO PIMENTEL	\N	t	2026-02-03 15:21:01.831
298	MUNICIPIO DE RIO CLARO	\N	t	2026-02-03 15:21:01.836
299	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	\N	t	2026-02-03 15:21:01.841
300	MUNICIPIO DE SANTA CRUZ DA CONCEICAO	\N	t	2026-02-03 15:21:01.845
301	MUNICIPIO DE CACHOEIRA PAULISTA	\N	t	2026-02-03 15:21:01.85
302	MUNICIPIO DE PRADOPOLIS	\N	t	2026-02-03 15:21:01.854
303	MUNICIPIO DE CHARQUEADA	\N	t	2026-02-03 15:21:01.858
304	MUNICIPIO DE FLORINEA	\N	t	2026-02-03 15:21:01.863
305	HOSPITAL DAS CLINICAS DA FACULDADE MEDICINA DE BOTUCATU	\N	t	2026-02-03 15:21:01.866
306	EMAE - EMPRESA METROPOLITANA DE AGUAS E ENERGIA SA	\N	t	2026-02-03 15:21:01.871
307	FUNDACAO PARA O REMEDIO POPULAR FURP	\N	t	2026-02-03 15:21:01.875
308	MUNICIPIO DE MAIRIPORA	\N	t	2026-02-03 15:21:01.879
309	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	\N	t	2026-02-03 15:21:01.883
310	MUNICIPIO DE SANTA GERTRUDES	\N	t	2026-02-03 15:21:01.887
311	MUNICIPIO DE PIRACICABA	\N	t	2026-02-03 15:21:01.892
312	MUNICIPIO DE ILHA COMPRIDA	\N	t	2026-02-03 15:21:01.897
313	MUNICIPIO DE CANANEIA	\N	t	2026-02-03 15:21:01.901
314	COMPANHIA DOCAS DE SAO SEBASTIAO	\N	t	2026-02-03 15:21:01.906
315	MUNICIPIO DE GUARAREMA	\N	t	2026-02-03 15:21:01.91
316	MUNICIPIO DE BAURU	\N	t	2026-02-03 15:21:01.915
317	MUNICIPIO DE IBIUNA	\N	t	2026-02-03 15:21:01.92
318	MUNICIPIO DE JAHU	\N	t	2026-02-03 15:21:01.926
319	POLICIA MILITAR DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.934
320	MUNICIPIO DE SAO JOAQUIM DA BARRA	\N	t	2026-02-03 15:21:01.942
321	MUNICIPIO DE SAO VICENTE	\N	t	2026-02-03 15:21:01.946
322	MUNICIPIO DE PATROCINIO PAULISTA	\N	t	2026-02-03 15:21:01.951
323	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	\N	t	2026-02-03 15:21:01.955
324	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:01.96
325	MUNICIPIO DE SAO JOAO DA BOA VISTA	\N	t	2026-02-03 15:21:01.964
326	MUNICIPIO DE ARACATUBA	\N	t	2026-02-03 15:21:01.969
327	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	\N	t	2026-02-03 15:21:01.973
328	MUNICIPIO DE MACATUBA	\N	t	2026-02-03 15:21:01.977
329	MUNICIPIO DE EMBU-GUACU	\N	t	2026-02-03 15:21:01.981
330	MUNICIPIO DE SOROCABA	\N	t	2026-02-03 15:21:01.985
331	MUNICIPIO DE PAULINIA	\N	t	2026-02-03 15:21:01.99
332	MUNICIPIO DE URUPES	\N	t	2026-02-03 15:21:01.994
333	MUNICIPIO DE SAO SEBASTIAO	\N	t	2026-02-03 15:21:01.998
334	MUNICIPIO DE BARRETOS	\N	t	2026-02-03 15:21:02.002
335	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	\N	t	2026-02-03 15:21:02.006
336	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	\N	t	2026-02-03 15:21:02.012
337	MUNICIPIO DE NOVA CAMPINA	\N	t	2026-02-03 15:21:02.016
338	MUNICIPIO DE SANTO ANTONIO DE POSSE	\N	t	2026-02-03 15:21:02.02
339	UNIVERSIDADE ESTADUAL DE CAMPINAS	\N	t	2026-02-03 15:21:02.026
340	MUNICIPIO DE TREMEMBE	\N	t	2026-02-03 15:21:02.03
341	MUNICIPIO DE PORANGABA	\N	t	2026-02-03 15:21:02.035
342	MUNICIPIO DE BARUERI	\N	t	2026-02-03 15:21:02.04
343	MUNICIPIO DE GUARACAI	\N	t	2026-02-03 15:21:02.045
344	MUNICIPIO DE TIETE	\N	t	2026-02-03 15:21:02.052
345	MUNICIPIO DE ILHABELA	\N	t	2026-02-03 15:21:02.057
346	MUNICIPIO DE MONTE MOR	\N	t	2026-02-03 15:21:02.062
347	MUNICIPIO DE VINHEDO	\N	t	2026-02-03 15:21:02.067
348	RP MOBI EMPRESA DE MOBILIDADE URBANA DE RIBEIRAO PRETO	\N	t	2026-02-03 15:21:02.072
349	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	\N	t	2026-02-03 15:21:02.076
350	MUNICIPIO DE AREALVA	\N	t	2026-02-03 15:21:02.081
351	MUNICIPIO DE PORTO FELIZ	\N	t	2026-02-03 15:21:02.085
352	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	\N	t	2026-02-03 15:21:02.09
353	MUNICIPIO DE SAO CAETANO DO SUL	\N	t	2026-02-03 15:21:02.095
354	MUNICIPIO DE SANTA RITA D'OESTE	\N	t	2026-02-03 15:21:02.099
355	MUNICIPIO DE CRUZEIRO	\N	t	2026-02-03 15:21:02.104
356	MUNICIPIO DE LORENA	\N	t	2026-02-03 15:21:02.109
357	SAO PAULO SECRETARIA MUNICIPAL DE MOBILIDADE E TRANSPORTES	\N	t	2026-02-03 15:21:02.113
358	AGENCIA PAULISTA DE PROMOCAO DE INVESTIMENTOS E COMPETITIVIDADE - INVESTE SAO PAULO	\N	t	2026-02-03 15:21:02.119
359	MUNICIPIO DE BOTUCATU	\N	t	2026-02-03 15:21:02.124
360	SECRETARIA DE COMUNICACAO	\N	t	2026-02-03 15:21:02.129
361	COMPANHIA DE PROCESSAMENTO DE DADOS DA PARAIBA CODATA	\N	t	2026-02-03 15:21:02.133
362	MUNICIPIO DE VOTUPORANGA	\N	t	2026-02-03 15:21:02.138
363	MUNICIPIO DE MARTINOPOLIS	\N	t	2026-02-03 15:21:02.142
364	MUNICIPIO DE TERRA ROXA	\N	t	2026-02-03 15:21:02.146
365	MUNICIPIO DE GUARATINGUETA	\N	t	2026-02-03 15:21:02.151
366	MUNICIPIO DE JACAREI	\N	t	2026-02-03 15:21:02.155
367	DESENVOLVE SP - AGENCIA DE FOMENTO DO ESTADO DE SAO PAULO S.A.	\N	t	2026-02-03 15:21:02.16
368	MUNICIPIO DE IPAUSSU	\N	t	2026-02-03 15:21:02.164
369	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	\N	t	2026-02-03 15:21:02.169
370	MUNICIPIO DE BATATAIS	\N	t	2026-02-03 15:21:02.173
371	MUNICIPIO DE JUNQUEIROPOLIS	\N	t	2026-02-03 15:21:02.177
372	MUNICIPIO DE TAQUARITINGA	\N	t	2026-02-03 15:21:02.181
373	MUNICIPIO DE RIBEIRAO BRANCO	\N	t	2026-02-03 15:21:02.185
374	MUNICIPIO DE ITAI	\N	t	2026-02-03 15:21:02.189
375	BRASIL IOT SEG. DA INFORMACAO LTDA	\N	t	2026-02-03 15:21:02.193
376	MUNICIPIO DE LEME	\N	t	2026-02-03 15:21:02.198
377	MUNICIPIO DE SANTO ANASTACIO	\N	t	2026-02-03 15:21:02.202
378	CONSELHO DE ARQUITETURA E URBANISMO DE SAO PAULO (CAU-SP)	\N	t	2026-02-03 15:21:02.206
379	MUNICIPIO DE LUCELIA	\N	t	2026-02-03 15:21:02.21
380	MUNICIPIO DE IGARACU DO TIETE	\N	t	2026-02-03 15:21:02.215
381	AGENCIA METROPOLITANA DE SOROCABA - AGEMSOROCABA	\N	t	2026-02-03 15:21:02.219
382	MUNICIPIO DE SAO JOSE DO RIO PRETO	\N	t	2026-02-03 15:21:02.223
383	PREFEITURA MUNICIPAL DE SALTO DE PIRAPORA	\N	t	2026-02-03 15:21:02.227
384	MUNICIPIO DE SARAPUI	\N	t	2026-02-03 15:21:02.232
385	MUNICIPIO DE SAO MANUEL	\N	t	2026-02-03 15:21:02.236
386	MUNICIPIO DE PINHALZINHO	\N	t	2026-02-03 15:21:02.24
387	MUNICIPIO DE OSASCO	\N	t	2026-02-03 15:21:02.244
388	MUNICIPIO DE COSMOPOLIS	\N	t	2026-02-03 15:21:02.249
389	MUNICIPIO DE PONTAL	\N	t	2026-02-03 15:21:02.254
390	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	\N	t	2026-02-03 15:21:02.259
391	MUNICIPIO DE MORUNGABA	\N	t	2026-02-03 15:21:02.263
392	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	\N	t	2026-02-03 15:21:02.268
393	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	\N	t	2026-02-03 15:21:02.272
394	MUNICIPIO DE PIEDADE	\N	t	2026-02-03 15:21:02.276
395	SECRETARIA DE ESTADO DE EDUCACAO DE MINAS GERAIS	\N	t	2026-02-03 15:21:02.28
396	MUNICIPIO DE ADAMANTINA	\N	t	2026-02-03 15:21:02.284
397	MUNICIPIO DE MATAO	\N	t	2026-02-03 15:21:02.289
398	FUNDACAO MEMORIAL DA AMERICA LATINA	\N	t	2026-02-03 15:21:02.293
399	MUNICIPIO DE BURITAMA	\N	t	2026-02-03 15:21:02.297
400	MUNICIPIO DE ITUVERAVA	\N	t	2026-02-03 15:21:02.301
401	MUNICIPIO DE VALPARAISO	\N	t	2026-02-03 15:21:02.305
402	MUNICIPIO DE DOBRADA	\N	t	2026-02-03 15:21:02.31
403	MUNICIPIO DE SANTA ROSA DE VITERBO	\N	t	2026-02-03 15:21:02.315
404	MUNICIPIO DE SUZANO	\N	t	2026-02-03 15:21:02.321
405	MUNICIPIO DE TAUBATE	\N	t	2026-02-03 15:21:02.326
406	MUNICIPIO DE ITU	\N	t	2026-02-03 15:21:02.334
407	MUNICIPIO DE BARRA BONITA	\N	t	2026-02-03 15:21:02.342
408	MUNICIPIO DE SERTAOZINHO	\N	t	2026-02-03 15:21:02.348
409	MUNICIPIO DE DIADEMA	\N	t	2026-02-03 15:21:02.354
410	MUNICIPIO DE GUAPIARA	\N	t	2026-02-03 15:21:02.359
411	MUNICIPIO DE VIRADOURO	\N	t	2026-02-03 15:21:02.365
412	MUNICIPIO DE CAMPINA DO MONTE ALEGRE	\N	t	2026-02-03 15:21:02.37
413	MUNICIPIO DE SAO BERNARDO DO CAMPO	\N	t	2026-02-03 15:21:02.375
414	EMP MUNIC DESENVOL URBANO RURAL DE BAURU	\N	t	2026-02-03 15:21:02.38
415	MUNICIPIO DE ITAPOLIS	\N	t	2026-02-03 15:21:02.386
416	FUNDACAO HEMOCENTRO DE RIBEIRAO PRETO	\N	t	2026-02-03 15:21:02.391
417	MUNICIPIO DE AGUAS DE LINDOIA	\N	t	2026-02-03 15:21:02.4
418	MUNICIPIO DE ILHA SOLTEIRA	\N	t	2026-02-03 15:21:02.41
419	MUNICIPIO DE BARIRI	\N	t	2026-02-03 15:21:02.415
420	MUNICIPIO DE CAPIVARI	\N	t	2026-02-03 15:21:02.421
421	CPTM	\N	t	2026-02-03 15:31:39.949
422	SPPREV	\N	t	2026-02-03 15:31:40.011
423	PROCON	\N	t	2026-02-03 15:31:40.106
424	JUCESP	\N	t	2026-02-03 15:31:40.174
425	MPSP	\N	t	2026-02-03 15:31:40.385
426	PREF. MOGI MIRIM	\N	t	2026-02-03 15:31:40.474
427	FUND. FLORESTAL	\N	t	2026-02-03 15:31:40.618
428	SEC. CULT. ECONOMIA	\N	t	2026-02-03 15:31:40.929
429	CGE	\N	t	2026-02-03 15:31:41.053
430	SDE	\N	t	2026-02-03 15:31:41.148
431	SEFAZ	\N	t	2026-02-03 15:31:41.194
432	SEDUC	\N	t	2026-02-03 15:31:41.328
433	SSP	\N	t	2026-02-03 15:31:41.439
434	DIPOL	\N	t	2026-02-03 15:31:41.553
435	ACADEPOL	\N	t	2026-02-03 15:31:41.632
436	SEMIL	\N	t	2026-02-03 15:31:41.691
437	SES	\N	t	2026-02-03 15:31:41.798
438	CASA CIVIL	\N	t	2026-02-03 15:31:41.937
439	CDHU	\N	t	2026-02-03 15:31:42.033
440	ADE SAMPA	\N	t	2026-02-03 15:31:42.192
441	SDUH	\N	t	2026-02-03 15:31:42.256
442	ISAUDE	\N	t	2026-02-03 15:31:42.365
443	POMIL-SP	\N	t	2026-02-03 15:31:42.399
444	IMESC	\N	t	2026-02-03 15:31:42.449
445	CPS	\N	t	2026-02-03 15:31:42.488
446	SEDS	\N	t	2026-02-03 15:31:42.573
447	IPEM	\N	t	2026-02-03 15:31:42.652
448	SGGD/APESP	\N	t	2026-02-03 15:31:42.69
449	IAMSPE	\N	t	2026-02-03 15:31:42.796
450	SEMAE-PIRACICABA	\N	t	2026-02-03 15:31:42.902
451	SEADE	\N	t	2026-02-03 15:31:42.965
452	FUND. MEMORIAL AL	\N	t	2026-02-03 15:31:43
453	STM	\N	t	2026-02-03 15:31:43.094
454	ARTESP	\N	t	2026-02-03 15:31:43.167
455	ARSESP	\N	t	2026-02-03 15:31:43.27
456	FUND. CASA	\N	t	2026-02-03 15:31:43.662
457	USP	\N	t	2026-02-03 15:31:44.06
458	DER	\N	t	2026-02-03 15:31:44.178
459	SECOM	\N	t	2026-02-03 15:31:44.268
460	SGRI	\N	t	2026-02-03 15:31:44.342
461	PREFEITURA SERRA NEGRA	\N	t	2026-02-03 15:31:44.518
462	TCE-AP	\N	t	2026-02-03 15:31:44.626
463	SEEC-DF	\N	t	2026-02-03 15:31:44.672
464	UNICAMP	\N	t	2026-02-03 15:31:44.779
465	PJE	\N	t	2026-02-03 15:31:44.885
466	ALESP	\N	t	2026-02-03 15:31:45.12
467	CAU-SP	\N	t	2026-02-03 15:31:45.298
468	IGC-SP	\N	t	2026-02-03 15:31:45.676
469	SMDET	\N	t	2026-02-03 15:31:45.793
470	SEDUC - PA	\N	t	2026-02-03 15:31:45.938
471	SEJUS	\N	t	2026-02-03 15:31:46.218
472	SEDUC-MG	\N	t	2026-02-03 15:31:46.283
473	IPT	\N	t	2026-02-03 15:31:46.409
474	SAA-SP	\N	t	2026-02-03 15:31:46.608
475	SEDPCD	\N	t	2026-02-03 15:31:46.813
476	SDPCD	\N	t	2026-02-03 15:31:46.869
477	PRO-SANGUE	\N	t	2026-02-03 15:31:47.024
478	SAA - CAMP	\N	t	2026-02-03 15:31:47.378
479	TJSP	\N	t	2026-02-03 15:31:47.421
480	BOMBEIROS	\N	t	2026-02-03 15:31:47.557
481	ALMG	\N	t	2026-02-03 15:31:47.624
482	CETESB	\N	t	2026-02-03 15:31:47.686
485	SCEC	\N	t	2026-02-03 15:31:48.041
487	SAA	\N	t	2026-02-03 15:31:48.112
488	PREF. TAGUARITINGA	\N	t	2026-02-03 15:31:48.166
489	FDE	\N	t	2026-02-03 15:31:48.202
490	SENAPPEN	\N	t	2026-02-03 15:31:48.236
491	IPEM-SP	\N	t	2026-02-03 15:31:48.286
492	CCD-SES	\N	t	2026-02-03 15:31:48.349
493	PREVCOM	\N	t	2026-02-03 15:31:48.417
494	SSP-SP	\N	t	2026-02-03 15:31:48.555
495	PRODEST	\N	t	2026-02-03 15:31:48.928
486	PREVIDÊNCIA SP	\N	t	2026-02-03 18:31:48.077
483	PREFEITURA JACAREÍ	\N	t	2026-02-03 18:31:47.869
37	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	t	2026-02-03 18:21:00.438
240	CONTROLADORIA GERAL DO ESTADO	CGE	t	2026-02-03 18:21:01.556
484	SEDUC - SÃO JOÃO	\N	t	2026-02-03 18:31:47.927
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, contract_number, object, company_name, start_date, end_date, total_value, current_balance, status, analista_responsavel, cliente, grupo_cliente, contrato, termo, status_vencimento, data_inicio_efetividade, data_fim_efetividade, data_limite_andamento, valor_contrato, valor_faturado, valor_cancelado, valor_a_faturar, valor_novo_contrato, tipo_tratativa, tipo_aditamento, etapa, objeto, secao_responsavel, observacao, numero_processo_sei_nosso, numero_processo_sei_cliente, contrato_cliente, contrato_anterior, numero_pnpp_crm, sei, contrato_novo, termo_novo, created_by, client_name, responsible_analyst, pd_number, sei_process_number, sei_send_area, esps, created_at) FROM stdin;
\.


--
-- Data for Name: cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cycles (id, name) FROM stdin;
2	CONTRATO NOVO
6	VENDA NOVA
1	RENOVAÇÃO
3	REQUISIÇÃO DE SERVIÇOS (RS)
4	PRORROGAÇÃO
5	PRORROGAÇÃO COM ADITAMENTO
7	RENOVAÇÃO COM MUDANÇA
\.


--
-- Data for Name: deadline_contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deadline_contracts (id, analista_responsavel, cliente, grupo_cliente, contrato, termo, status, status_vencimento, data_inicio_efetividade, data_fim_efetividade, data_limite_andamento, valor_contrato, valor_faturado, valor_cancelado, valor_a_faturar, valor_novo_contrato, objeto, tipo_tratativa, tipo_aditamento, etapa, secao_responsavel, observacao, numero_processo_sei_nosso, numero_processo_sei_cliente, contrato_cliente, contrato_anterior, numero_pnpp_crm, sei, contrato_novo, termo_novo, created_by, created_at, updated_at) FROM stdin;
1	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD251173		Ativo		2025-08-01 03:00:00	2028-01-31 03:00:00	\N	25312.00	4277.30	0.00	21034.70	0.00	SAM - MODULO PATRIM??NIO				E0251305\nE0251308		359.00006246/2025-92									2025-12-09 17:19:01.908	2025-12-11 13:27:27.312
2	NADIA BERTUCCELLI	MUNICIPIO DE AGUAS DE LINDOIA	SERVI??OS PREFEITURAS	PD022555	T03	Ativo		2025-10-24 03:00:00	2027-10-23 03:00:00	\N	530640.00	4962.20	0.00	525677.80	0.00	PREFEITURA CADASTRO				E0220555											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
3	BARBARA ALMEIDA TUNES FERNANDES	CORPO DE BOMBEIROS DA POLICIA MILITAR DO ESTADO DE SAO PAULO	BOMBEIROS	PD024318	T0	Ativo		2025-04-29 03:00:00	2027-10-28 03:00:00	\N	232208.62	36722.00	0.00	195486.62	0.00	SAM  PATRIMONIO				E0240464											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
4	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE POTIRENDABA	SERVI??OS PREFEITURAS	PD024706	T02	Ativo		2025-10-30 03:00:00	2027-10-29 03:00:00	\N	33613.20	590.95	0.00	33022.25	0.00	PREFEITURA SIM				E0240706											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
5	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024118	T0	Ativo		2025-05-01 03:00:00	2027-10-31 03:00:00	\N	1627816.43	223592.11	0.00	1404224.32	0.00	AMBIENTE UNIFICADO DOS SISTEMAS KCR, KCX, KCO E QUITA????O ANTECIPADA DA CARTEIRA PREDIAL				E0240209											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
6	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTO ANDRE	SERVI??OS PREFEITURAS	PD023672	T02	Ativo		2025-11-01 03:00:00	2027-10-31 03:00:00	\N	7772880.00	164894.42	0.00	7607985.58	0.00	PREFEITURA CADASTRO				E0230672											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
7	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD024380	T0	Ativo		2024-11-05 03:00:00	2027-11-04 03:00:00	\N	839.35	839.35	0.00	0.00	0.00	CERTIFICADO DIGITAL E-CPF - E-CNPJ				E0240532											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
8	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD022112	T01	Ativo		2025-05-17 03:00:00	2027-11-16 03:00:00	\N	64173.65	3085.04	0.00	61088.61	0.00	PROGRAMA SP SEM PAPEL				E0220149											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
9	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD022324	T01	Ativo		2025-05-29 03:00:00	2027-11-28 03:00:00	\N	13199.68	1945.14	0.00	11254.54	0.00	PROGRAMA SP SEM PAPEL				E0220423											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
10	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024228	T0	Ativo		2024-12-15 03:00:00	2027-12-14 03:00:00	\N	7688081.05	1485304.17	0.00	6202776.88	0.00	NUVEM PUBLICA				E0240346											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
11	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024493	T0	Ativo		2024-12-19 03:00:00	2027-12-18 03:00:00	\N	2445786.01	754782.83	0.00	1691003.18	0.00	PaaS MIDDLEWARE				E0241071											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
12	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD025196	T0	Ativo		2025-07-14 03:00:00	2028-01-13 03:00:00	\N	28562217.60	2779168.56	0.00	25783049.04	0.00	DESENVOLVIMENTO, MANUTEN????O EVOLUTIVA E SUSTENTA????O DOS SISTEMAS DE TI				E0250228		359.00002855/2025-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
13	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD025212	T0	Ativo		2025-09-06 03:00:00	2028-03-05 03:00:00	\N	824481.30	49226.27	0.00	775255.03	0.00	PROGRAMA SP SEM PAPEL				E0250247		359.00004283/2025-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
14	PAULO MARCELLO DA SILVA FERREIRA	PREFEITURA DE SANTA BRANCA		PD251699	T0	Ativo	\N	2026-01-05 03:00:00	2027-01-04 03:00:00	\N	16147.44	0.00	0.00	16147.44	0.00	Plataforma Colaborativa	FINALIZADA			E0251832		359.00011061/2025-08				OPTY2104	359.00011061/2025-08			\N	2026-01-06 13:53:12.67	2026-01-06 18:56:38.31
15	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD024030	T01	Ativo		2025-10-20 03:00:00	2026-05-19 03:00:00	\N	708693.60	0.00	0.00	708693.60	0.00	DESENVOLVIMENTO SISTEMA CONECTA-SP	PRORROGA????O		12. Finalizado (0)	E0240039	Assinado	359.00009911/2023-38		024/2025		14770.2025	359.00009911/2023-38				2025-12-09 17:19:01.908	2025-12-16 14:55:32.062
16	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	PD023384	T02	Ativo		2025-12-01 03:00:00	2027-11-30 03:00:00	\N	3195.36	0.00	0.00	3195.36	0.00	PROGRAMA  SP SEM PAPEL				E0230467											2025-12-09 17:19:01.908	2025-12-11 13:29:39.719
17	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD024462	T0	Encerrado		2024-12-03 03:00:00	2025-12-02 03:00:00	\N	52123.37	43436.10	0.00	8687.27	0.00	PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0241032	01/12 - Vai ser encerrado, n??o v??o seguir com a prorroga????o	359.00008839/2024-11									2025-12-09 17:19:01.908	2025-12-15 15:00:08.83
18	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD022409	T0	Ativo		2022-12-06 03:00:00	2027-12-05 03:00:00	\N	61959.36	15101.32	0.00	46858.04	0.00	CERTIFICADO SSL  WildCard				E0220842		359.00009514/2023-66									2025-12-09 17:19:01.908	2025-12-11 13:22:44.737
19	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD0251164	T0	Ativo		2025-10-28 03:00:00	2028-04-27 03:00:00	\N	6055.90	0.00	0.00	6055.90	0.00	SAM ESTOQUE E PATRIMONIO - CARGA ADICIONAL				E0251284											2025-12-09 17:19:01.908	2025-12-09 20:04:07.354
20	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ROSANA	SERVI??OS PREFEITURAS	PD251067	T0	Ativo		2025-12-06 03:00:00	2026-06-11 03:00:00	\N	38664.00	2878.32	0.00	35785.68	0.00	PREFEITURA - CADASTRO				E0251148		359.00003284/2025-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
21	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD021339	T02	Ativo		2025-06-14 03:00:00	2026-06-13 03:00:00	\N	29526.44	29526.43	0.00	0.01	0.00	PROGRAMA SP SEM PAPEL				E0210444		359.00004500/2024-37 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
22	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PDC21339	T02	Ativo		2025-10-01 03:00:00	2026-06-13 03:00:00	\N	82884.52	8278.46	0.00	74606.06	0.00	PROGRAMA SP SEM PAPEL				EC210444											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
23	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE DESENVOLVIMENTO SOCIAL	SEDS	PD024420	T0	Ativo		2025-06-16 03:00:00	2026-06-15 03:00:00	\N	60265.58	19684.80	0.00	40580.78	0.00	SAM ESTOQUE				E0240583		359.00008622/2024-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
24	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD025013	T0	Ativo		2025-06-16 03:00:00	2026-06-15 03:00:00	\N	941107.80	335334.18	0.00	605773.62	0.00	OFFICE				E0250017		359.00010230/2024-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
25	DAIANE DA SILVA SOUZA	MUNICIPIO DE MONTE ALEGRE DO SUL	SERVI??OS PREFEITURAS	PD251083	T0	Ativo		2025-06-17 03:00:00	2026-06-16 03:00:00	\N	7732.80	3222.00	0.00	4510.80	0.00	PREFEITURA - CADASTRO				E0251167		359.00003520/2025-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
26	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD024441	T0	Ativo		2025-06-18 03:00:00	2026-06-17 03:00:00	\N	10404301.31	2449047.39	0.00	7955253.92	0.00	SAOG - OUTSOURCING TIC				E0241007 \nE0241008 		359.00009086/2024-52									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
27	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD022033	T03	Ativo		2025-03-19 03:00:00	2026-06-18 03:00:00	\N	100491512.80	60460154.48	0.00	40031358.32	0.00	NUVEM				E0220044		359.00004861/2023-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
28	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD025026	T0	Ativo		2025-03-19 03:00:00	2026-06-18 03:00:00	\N	73830.00	36422.80	0.00	37407.20	0.00	SAM ESTOQUE				E0250031		359.00010602/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
29	MARIA REGINA FUNICELLO	BANCO RENDIMENTO S.A.	RENDIMENTO	PD025156	T0	Ativo		2025-06-20 03:00:00	2026-06-19 03:00:00	\N	35515.32	12223.19	0.00	23292.13	0.00	HOSPEDAGEM				E0250179		359.0000.3072/2025-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
30	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD251138	T0	Ativo		2025-06-23 03:00:00	2026-06-22 03:00:00	\N	506035.20	171769.21	0.00	334265.99	0.00	OFFICE				E0251243		359.00004174/2025-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
31	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITATINGA	SERVI??OS PREFEITURAS	PD251166	T0	Ativo		2025-06-25 03:00:00	2026-06-24 03:00:00	\N	25776.00	6476.22	0.00	19299.78	0.00	PREFEITURA - CADASTRO				E0251289		359.00004822/2025-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
32	NADIA BERTUCCELLI	MUNICIPIO DE ITUPEVA	SERVI??OS PREFEITURAS	PD251042	T0	Ativo		2025-06-25 03:00:00	2026-06-24 03:00:00	\N	164304.00	2523.60	0.00	161780.40	0.00	PREFEITURA - CADASTRO				E0251058		359.00002792/2025-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
33	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA CIVIL DO ESTADO DE SAO PAULO	DIPOL	PD025132		Ativo		2025-06-26 03:00:00	2026-06-25 03:00:00	\N	13855.00	277.10	0.00	13577.90	0.00	CERTIFICADO DIGITAL				E0250154		359.00001308/2025-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
34	JUNEIDY SOLANGE BETECA JONY	FUNDACAO DE PREVIDENCIA COMPLEMENTAR DO ESTADO DE SAO PAULO	PREVCOM	PD251170	T0	Ativo		2025-06-26 03:00:00	2026-06-25 03:00:00	\N	230217.60	76739.20	0.00	153478.40	0.00	OFFICE				E0251299		359.00002516/2025-96									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
35	DAIANE DA SILVA SOUZA	MUNICIPIO DE MONGAGUA	SERVI??OS PREFEITURAS	PD024722	T0	Ativo		2025-06-27 03:00:00	2026-06-26 03:00:00	\N	708600.00	96468.00	0.00	612132.00	0.00	PREFEITURA - CADASTRO				E0240722		359.00005723/2025-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
36	NADIA BERTUCCELLI	MUNICIPIO DE SAO JOSE DO RIO PARDO	SERVI??OS PREFEITURAS	PD024710	T0	Ativo		2025-06-27 03:00:00	2026-06-26 03:00:00	\N	42530.40	8645.70	0.00	33884.70	0.00	PREFEITURA - CADASTRO				E0240710		359.00009895/2024-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
37	KARINA FREIRE GRANDA SALLES	COMPANHIA PAULISTA DE PARCERIAS - CPP	CPP	PD025097		Ativo		2025-06-30 03:00:00	2026-06-29 03:00:00	\N	93072.00	31024.00	0.00	62048.00	0.00	OFFICE				E0250112		359.00003075/2025-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
38	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD020283	T02	Ativo		2023-07-01 03:00:00	2026-06-30 03:00:00	\N	866160.00	361381.20	0.00	504778.80	0.00	GEST??O INTRAGOV				E0200367		359.00001510/2023-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
39	DAIANE DA SILVA SOUZA	MUNICIPIO DE LINS	SERVI??OS PREFEITURAS	PD251060	T0	Ativo		2025-04-07 03:00:00	2026-07-03 03:00:00	\N	483120.00	5284.08	0.00	477835.92	0.00	PREFEITURA - CADASTRO				E0251139		359.00003107/2025-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
40	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD023468	T01	Ativo		2025-12-04 03:00:00	2026-06-03 03:00:00	\N	2877902.18	0.00	0.00	2877902.18	0.00	INFRA ESTRUTURA VIRTUALIZADA ON PREMISES - PAAS BANCO DE  DADOS ORACLE - PAAS BANCO DE  DADOS MICROSOFT  SQL - CERTIFICADO SSL STANDARD - SMTP	SEM TRATATIVA			E0230589	Assinado	359.00008770/2023-36									2025-12-09 17:19:01.908	2026-01-13 18:26:03.18
41	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PDC21195		Ativo		2025-06-14 03:00:00	2026-06-13 03:00:00	\N	784073.76	336341.32	0.00	447732.44	0.00	CO-LOCATION VIRTUALIZADO				EC210236		359.00005464/2024-29									2025-12-09 17:19:01.908	2026-01-13 19:20:58.075
42	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD025200	T0	Ativo		2025-06-18 03:00:00	2026-06-17 03:00:00	\N	1996276.08	497415.79	0.00	1498860.29	0.00	NUVEM				E0250233		359.00003680/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
43	JUNEIDY SOLANGE BETECA JONY	SECRETARIA MUNICIPAL DAS SUBPREFEITURAS	SMSUB	PD023049	T02	Ativo		2025-06-21 03:00:00	2026-06-20 03:00:00	\N	144293.90	56145.91	0.00	88147.99	0.00	SISTEMA INTEGRADO DE MULTAS - SIM				E0230058		359.00002766/2023-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
45	LUCIANO PACHECO	SP CASA CIVIL	CASA CIVIL	PD025170	T0	Ativo		2025-07-08 03:00:00	2026-07-07 03:00:00	\N	21336809.85	4680359.30	0.00	16656450.55	0.00	DESENVOLVIMENTO DE SISTEMAS				E0250196		359.00002428/2025-94									2025-12-09 17:19:01.908	2026-01-06 18:01:05.405
46	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE RPUSP	HCRPUSP	PD251014	T0	Ativo		2025-07-11 03:00:00	2026-07-10 03:00:00	\N	2363.04	787.68	0.00	1575.36	0.00	OFFICE				E0251017		359.00002420/2025-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
47	NADIA BERTUCCELLI	MUNICIPIO DE CARAGUATATUBA	SERVI??OS PREFEITURAS	PD251082	T0	Ativo		2025-11-07 03:00:00	2026-07-10 03:00:00	\N	1030789.32	182444.60	0.00	848344.72	0.00	PREFEITURA - CADASTRO				E0251166		359.00003508/2025-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
48	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE AGUAS DE SAO PEDRO	SERVI??OS PREFEITURAS	PD251024	T0	Ativo		2025-07-15 03:00:00	2026-07-14 03:00:00	\N	27771.12	1449.90	0.00	26321.22	0.00	PREFEITURA - SIM				E0251030		359.00002113/2025-47									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
49	NADIA BERTUCCELLI	MUNICIPIO DE PRESIDENTE VENCESLAU	SERVI??OS PREFEITURAS	PD021720	TI-2025	Ativo		2025-10-01 03:00:00	2026-07-16 03:00:00	\N	8194.90	8194.90	0.00	0.00	0.00	PREFEITURA CADASTRO				E0210720											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
50	NADIA BERTUCCELLI	MUNICIPIO DE BOCAINA	SERVI??OS PREFEITURAS	PD025100	T0	Ativo		2025-07-23 03:00:00	2026-07-22 03:00:00	\N	7732.80	1943.94	0.00	5788.86	0.00	PREFEITURA - CADASTRO				E0250115		359.00000581/2025-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
51	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CASA BRANCA	SERVI??OS PREFEITURAS	PD025138	T0	Ativo		2025-07-25 03:00:00	2026-07-24 03:00:00	\N	23198.40	2352.06	0.00	20846.34	0.00	PREFEITURA - CADASTRO				E0250160		359.00001401/2025-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
52	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE VARGEM GRANDE PAULISTA	SERVI??OS PREFEITURAS	PD025147	T0	Ativo		2025-07-25 03:00:00	2026-07-24 03:00:00	\N	85449.62	12564.81	0.00	72884.81	0.00	PREFEITURA - SIM				E0250169		359.00001808/2025-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
53	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PDC24174		Ativo		2025-05-01 03:00:00	2026-07-28 03:00:00	\N	1874733.13	739849.70	0.00	1134883.43	0.00	SERVI??OS DE SUPORTE T??CNICO LOCAL, SERVI??OS DE CENTRAL DE ATENDIMENTO (HELP DESK/SERVICE DESK) E  SERVI??OS DE PROCESSAMENTO DE DADOS EM MAINFRAME UNISYS NO DATA CENTER PRODESP				EC240284		359.00003267/2024-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
54	DAIANE DA SILVA SOUZA	MUNICIPIO DE MIGUELOPOLIS	SERVI??OS PREFEITURAS	PD251151	T0	Ativo		2025-07-30 03:00:00	2026-07-29 03:00:00	\N	38664.00	2577.60	0.00	36086.40	0.00	PREFEITURA - CADASTRO				E0251263		359.00003827/2025-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
55	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD025237	T0	Ativo		2025-07-31 03:00:00	2026-07-30 03:00:00	\N	13916232.52	2832488.13	0.00	11083744.39	0.00	INFRAESTRUTURA				E0250282		359.0003686/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
56	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IBIUNA	SERVI??OS PREFEITURAS	PD251053	T0	Ativo		2025-07-31 03:00:00	2026-07-30 03:00:00	\N	90216.00	17216.22	0.00	72999.78	0.00	PREFEITURA - CADASTRO				E0251077		359.00004591/2025-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
57	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD025204		Ativo		2025-08-01 03:00:00	2026-07-31 03:00:00	\N	211976.36	10745.91	0.00	201230.45	0.00	FOLHA DE PAGAMENTO				E0250238		359.00003743/2025-39									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
58	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024463	T0	Ativo		2025-04-08 03:00:00	2026-08-03 03:00:00	\N	129703.80	21617.30	0.00	108086.50	0.00	SAM ESTOQUE				E0241033		359.00010378/2024-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
59	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024057	T0	Ativo		2025-07-08 03:00:00	2026-08-06 03:00:00	\N	26115446.15	6088339.17	0.00	20027106.98	0.00	NUVEM				E0240083		359.00005452/2024-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
60	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE GUAREI	SERVI??OS PREFEITURAS	PD251188	T0	Ativo		2025-08-20 03:00:00	2026-08-19 03:00:00	\N	7732.80	1933.20	0.00	5799.60	0.00	PREFEITURA - CADASTRO				E0251335		359.00005207/2025-78									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
61	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO JOAO DA BOA VISTA	SERVI??OS PREFEITURAS	PD251027	T0	Ativo		2025-08-25 03:00:00	2026-08-24 03:00:00	\N	246960.00	50891.22	0.00	196068.78	0.00	PREFEITURA - CADASTRO				E0251034		359.00004254/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
62	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BARRETOS	SERVI??OS PREFEITURAS	PD251169	T0	Ativo		2025-08-28 03:00:00	2026-08-27 03:00:00	\N	306000.00	53243.76	0.00	252756.24	0.00	PREFEITURA - CADASTRO				E0251296		359.00004911/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
63	JUNEIDY SOLANGE BETECA JONY	SERVICO MUNICIPAL DE AGUA E ESGOTO	SEMAE	PD251033	T0	Ativo		2025-08-28 03:00:00	2026-08-27 03:00:00	\N	140289.00	24459.00	0.00	115830.00	0.00	OFFICE				E0250209		359.00002622/2025-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
64	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD251191	T0	Ativo		2025-08-30 03:00:00	2026-08-29 03:00:00	\N	1768472.16	149828.88	0.00	1618643.28	0.00	OFFICE				E0251338		359.00005475/2025-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
65	JUNEIDY SOLANGE BETECA JONY	FUND PROF DR MANOEL PEDRO PIMENTEL	FUNAP	PD251063	T0	Ativo		2025-08-30 03:00:00	2026-08-29 03:00:00	\N	143622.36	23937.06	0.00	119685.30	0.00	OFFICE				E0251143		359.00003180/2025-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
66	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DA BAIXADA SANTISTA - AGEM	AGEM	PD021229	T04	Ativo		2025-06-01 03:00:00	2026-08-31 03:00:00	\N	3292.49	736.09	0.00	2556.40	0.00	FOLHA DE PAGAMENTO				E0210293		359.00002536/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
68	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD025088		Ativo		2025-07-22 03:00:00	2026-07-21 03:00:00	\N	28554.84	7852.59	0.00	20702.25	0.00	OFFICE				E0250103		359.00000409/2025-23									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
69	JUNEIDY SOLANGE BETECA JONY	FUNDACAO HEMOCENTRO DE RIBEIRAO PRETO	FUNDHERP	PD025228		Ativo		2025-07-08 03:00:00	2026-07-07 03:00:00	\N	108.98	33.64	0.00	75.34	0.00	PROGRAMA SP SEM PAPEL				E0250268		359.00004757/2025-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
70	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD024365	T0	Ativo		2024-12-03 03:00:00	2025-12-02 03:00:00	\N	258414.00	258414.00	0.00	0.00	0.00	OFFICE B??SICO				E0240512	04/12 - Na GJU	359.00007172/2024-21						PD251038			2025-12-09 17:19:01.908	2025-12-30 13:08:05.359
71	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD025251	T0	Ativo		2025-08-27 03:00:00	2026-08-26 03:00:00	\N	395.86	395.86	0.00	0.00	0.00	CERTIFICADO DIGITAL				E0250304		359.00005912/2025-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
72	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD021026	T05	Ativo		2025-01-29 03:00:00	2026-01-28 03:00:00	\N	290152960.56	233291404.17	0.00	56861556.39	0.00	ACESSO A PLATAFORMA, NUVEM P??BLICA E DESENVOLVIMENTO	SEM TRATATIVA			E0210031	01/12 - Temos proposta de renova????o h?? mais de ano... estou preocupada... abrirei proposta de prorroga????o....	359.00009644/2023-07									2025-12-09 17:19:01.908	2025-12-30 13:32:59.113
73	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD251167	T0	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	203430.60	33905.10	0.00	169525.50	0.00	OFFICE				E0251290		359.00004823/2025-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
74	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD251124	T0	Ativo		2025-01-09 03:00:00	2026-08-31 03:00:00	\N	39250.80	6541.80	0.00	32709.00	0.00	OFFICE				E0251221		359.00003852/2025-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
75	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023105	T02	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	6167016.00	1026660.00	0.00	5140356.00	0.00	PAAS BANCO DE DADOS ORACLE - VPN				E0230124											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
76	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD251163	T0	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	560700.00	93450.00	0.00	467250.00	0.00	PLATAFORMA COLABORATIVA I				E0251281											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
77	DAIANE DA SILVA SOUZA	MUNICIPIO DE JUNDIAI	SERVI??OS PREFEITURAS	PD021734	T04	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	2586600.00	276230.94	0.00	2310369.06	0.00	PREFEITURA CADASTRO				E0210734											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
78	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA BARBARA D'OESTE	SERVI??OS PREFEITURAS	PD021737	T04	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	666840.00	55787.66	0.00	611052.34	0.00	PREFEITURA CADASTRO				E0210737											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
79	NADIA BERTUCCELLI	MUNICIPIO DE PINHALZINHO	SERVI??OS PREFEITURAS	PD022578	T03	Ativo		2025-09-02 03:00:00	2026-09-01 03:00:00	\N	55104.00	2824.08	0.00	52279.92	0.00	PREFEITURA - CADASTRO				E0220578		359.00007654/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
80	DAIANE DA SILVA SOUZA	MUNICIPIO DE BARIRI	SERVI??OS PREFEITURAS	PD251362	T0	Ativo		2025-02-09 03:00:00	2026-09-01 03:00:00	\N	19332.00	1890.24	0.00	17441.76	0.00	PREFEITURA - CADASTRO				E0251469		359.00007528/2025-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
81	DAIANE DA SILVA SOUZA	MUNICIPIO DE CONCHAL	SERVI??OS PREFEITURAS	PD251289	T0	Ativo		2025-03-09 03:00:00	2026-09-02 03:00:00	\N	25776.00	1288.80	0.00	24487.20	0.00	PREFEITURA - CADASTRO				E0251390		359.00005501/2024-07									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
82	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PARAGUACU PAULISTA	SERVI??OS PREFEITURAS	PD024659	T01	Ativo		2025-09-04 03:00:00	2026-09-03 03:00:00	\N	47334.00	2006.06	0.00	45327.94	0.00	PREFEITURA CADASTRO				E0240659											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
83	NADIA BERTUCCELLI	MUNICIPIO DE CONCHAS	SERVI??OS PREFEITURAS	PD251438	T0	Ativo		2025-05-09 03:00:00	2026-09-04 03:00:00	\N	25634.88	1471.17	0.00	24163.71	0.00	PREFEITURA - SIM				E0251547		359.00008446/2025-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
84	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023396	T0	Ativo		2024-09-06 03:00:00	2026-09-05 03:00:00	\N	1757305.87	421672.46	0.00	1335633.41	0.00	ANTIVIRUS				E0230485		359.00000457/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
85	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023416	T0	Ativo		2024-09-06 03:00:00	2026-09-05 03:00:00	\N	338344.43	205266.90	0.00	133077.53	0.00	PROGRAMA SP SEM PAPEL				E0230514		359.00000470/2024-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
86	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023417	T0	Ativo		2024-09-06 03:00:00	2026-09-05 03:00:00	\N	1042482.73	572280.94	0.00	470201.79	0.00	SAM PATRIM??NIO				E0230515		359.00000231/2024-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
87	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023454	T0	Ativo		2024-09-06 03:00:00	2026-09-05 03:00:00	\N	40745227.42	12625010.09	0.00	28120217.33	0.00	MANUTEN????O DO SISTEMA				E0230567		359.00001371/2024-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
88	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD024018	T0	Ativo		2024-09-06 03:00:00	2026-09-05 03:00:00	\N	60069741.73	29899892.75	0.00	30169848.98	0.00	OUTSOURCING				E0240023		359.00000241/2024-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
89	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD024033	T0	Ativo		2024-09-06 03:00:00	2026-09-05 03:00:00	\N	36655576.26	10413663.52	0.00	26241912.74	0.00	MANUTEN????O DO SISTEMA				E0240044		359.00000832/2024-42									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
90	NADIA BERTUCCELLI	MUNICIPIO DE ARACARIGUAMA	SERVI??OS PREFEITURAS	PD022543	T03	Ativo		2025-09-06 03:00:00	2026-09-05 03:00:00	\N	68880.00	4144.28	0.00	64735.72	0.00	PREFEITURA CADASTRO				E0220543											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
91	NADIA BERTUCCELLI	MUNICIPIO DE PITANGUEIRAS	SERVI??OS PREFEITURAS	PD024658	T01	Ativo		2025-09-06 03:00:00	2026-09-05 03:00:00	\N	37181.57	2154.41	0.00	35027.16	0.00	PREFEITURA CADASTRO				E0240658											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
92	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD022266	T02	Ativo		2025-06-08 03:00:00	2026-09-07 03:00:00	\N	1192365.30	191481.46	0.00	1000883.84	0.00	INFRAESTRUTURA				E0220357		359.00000135/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
93	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD024338	T01	Ativo		2025-09-08 03:00:00	2026-09-07 03:00:00	\N	381312.24	63552.04	0.00	317760.20	0.00	OFFICE B??SICO				E0240482											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
94	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD024338	T01	Ativo		2025-09-08 03:00:00	2026-09-07 03:00:00	\N	381312.24	63552.04	0.00	317760.20	0.00	OFFICE PLUS				E0240506											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
95	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD024092	T0	Ativo		2024-09-09 03:00:00	2026-09-08 03:00:00	\N	80014762.90	30875934.37	0.00	49138828.53	0.00	SUSTENTA????O				E0240139		359.00000197/2024-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
96	JUNEIDY SOLANGE BETECA JONY	FUND PROF DR MANOEL PEDRO PIMENTEL	FUNAP	PD022292	T03	Ativo		2025-09-09 03:00:00	2026-09-08 03:00:00	\N	8623.20	1437.20	0.00	7186.00	0.00	SAM PATRIMONIO				E0220384											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
98	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	SEC. CULTURA	PD251086	T0	Ativo		2025-02-09 03:00:00	2026-09-01 03:00:00	\N	578843.28	96473.88	0.00	482369.40	0.00	OFFICE				E0251174		359.00003545/2025-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
99	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD251114	T0	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	881804.40	146967.40	0.00	734837.00	0.00	PLATAFORMA COLABORATIVA I				E0251266											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
100	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IPIGUA	SERVI??OS PREFEITURAS	PD024725	T00	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	9613.08	5319.51	0.00	4293.57	0.00	PREFEITURA - SIM	PRORROGA????O		8. Solicita????o de Atualiza????o da Minuta Contratual (15 a 5)	E0240725	03/12 - Aguardando retorno da ficha e da minuta	359.00011276/2024-30									2025-12-09 17:19:01.908	2025-12-30 13:41:58.889
102	PAULO MARCELLO DA SILVA FERREIRA	CONSELHO DE ARQUITETURA E URBANISMO DE SAO PAULO (CAU-SP)	CAU - SP	PD251894	T0	Ativo	Em dia	2025-12-31 03:00:00	2026-12-30 03:00:00	\N	1693692.96	0.00	0.00	1693692.96	0.00	PaaS MIDDELEWARE E WHATSAPP	FINALIZADA			E0251773		359.00007496/2024-69	00179.005651/2025-11	028/2025	PD024390	OPTY1398	359.00007496/2024-69	\N			2026-01-06 13:54:32.791	2026-01-06 13:57:10.316
103	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PDC19186	T0-T1	Encerrado		2023-04-01 03:00:00	2025-02-09 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SERVICOS DE INFRAESTRUTURA FISICA				EC190242	19/03/25 - Em conversa com o James, n??o ser?? necess??rio prorrogar o prazo do contrato. Os pr??ximos servi??os ser??o realizados sob um novo contrato em elabora????o pela equipe de Vendas	359.00001963/2024-47									2025-12-09 17:19:01.908	2026-01-13 19:30:58.342
104	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD201917	T07	Encerrado		2024-04-01 03:00:00	2025-03-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HOSPEDAGEM DE SITE E CERTIFICADO DIGITAL				EC201917	Assinado	359.00002858/2024-25									2025-12-09 17:19:01.908	2026-01-13 20:00:40.174
105	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD023383	T01	Ativo		2024-12-21 03:00:00	2025-04-20 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO E PAAS MIDDLEWARE COM SERVICO DE GESTAO				E0230466	Assinado	359.00009706/2023-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
106	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD024327	T0	Ativo		2024-12-20 03:00:00	2025-12-19 03:00:00	\N	3410973.82	3100068.62	0.00	310905.20	0.00	NEXT GENERATION FIREWALL- NGFW  E FAAS				E0240471	AGUARDANDO OS BLOCOS 04/12	359.00006218/2024-94									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
107	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD023450	T02	Ativo		2024-12-22 03:00:00	2025-12-21 03:00:00	\N	50719651.67	24394416.34	0.00	26325235.33	0.00	DESENVOLVIMENTO SISTEMA CARTEIRA DE MUTU??RIOS				E0230557\nE0230558\nE0230559\nE0230560	GJU 02/12\nSOLICITAR PRIORIDADE	359.00009718/2023-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
108	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD025161	T0	Ativo		2025-04-22 03:00:00	2027-04-21 03:00:00	\N	6580970.82	2425384.09	0.00	4155586.73	0.00	PaaS - OFFICE  BASICO				E0250186											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
109	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD251078	T0	Ativo		2025-06-27 03:00:00	2026-06-26 03:00:00	\N	3247419.60	797854.10	0.00	2449565.50	0.00	OFFICE				E0251161		359.00002453/2025-78									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
110	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD019231	T04	Ativo		2024-06-18 03:00:00	2025-06-17 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PRODESP E PLATAFORMA COM SERVI??O PAAS				E0190297	Assinado	359.00002332/2023-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
111	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD023277	T0	Ativo		2024-06-27 03:00:00	2025-06-26 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO				E0230316	Assinado (Renovado no PD251078)	359.00006718/2023-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
112	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD024189	T0	Ativo		2024-09-01 03:00:00	2025-11-30 03:00:00	\N	94249.30	0.00	0.00	94249.30	0.00	FOLHA PAGAMENTO				E0240307	Assinado	359.00005731/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
113	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD022369	T02	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES				EC220478											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
114	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD024283	T0	Ativo		2025-11-12 03:00:00	2026-11-11 03:00:00	\N	1463680.71	0.00	0.00	1463680.71	0.00	INFRAESTRUTURA				E0240419											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
115	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD251159	T0	Ativo		2025-11-14 03:00:00	2026-11-13 03:00:00	\N	2431.06	0.00	0.00	2431.06	0.00	CERTIFICADO WILDCARD				E0251276											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
116	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD024189	T01	Ativo		2025-12-01 03:00:00	2027-02-28 03:00:00	\N	94249.30	0.00	0.00	94249.30	0.00	FOLHA PAGAMENTO				E0240307											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
101	PAULO MARCELLO DA SILVA FERREIRA	CONSELHO DE ARQUITETURA E URBANISMO DE SAO PAULO (CAU-SP)	CAU - SP	PD024390	T0	Renovado	\N	\N	\N	\N	1364457.64	1240876.23	0.00	123581.41	0.00	PaaS MIDDELEWARE E SMS	\N	\N	\N	E0240544	\N	359.00007496/2024-69	\N	\N	\N	\N	\N	PD251894	\N	\N	2025-12-09 17:19:01.908	2026-01-06 13:54:32.801
117	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD024015	T0	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	2939593.60	823092.31	0.00	2116501.29	0.00	INFRAESTRUTURA DE TI - OUTSOURCING				E0240020	Assinado	359.00004799/2024-20									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
118	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD022376	T03	Ativo		2024-11-09 03:00:00	2025-11-08 03:00:00	\N	18944.04	0.00	0.00	18944.04	0.00	SAM ESTOQUE-PATRIMONIO				E0220488	Assinado	359.00005902/2023-78									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
119	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD021045	T04	Ativo		2024-12-01 03:00:00	2026-02-28 03:00:00	\N	10134.65	2375.52	0.00	7759.13	0.00	FOLHA DE PAGAMENTO				E0210060		359.00005921/2023-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
120	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD251277	T0	Ativo		2025-01-09 03:00:00	2026-08-31 03:00:00	\N	185125.20	25711.84	0.00	159413.36	0.00	OFFICE				E0251377											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
121	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD251277	T0	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	185125.20	25711.84	0.00	159413.36	0.00	PLATAFORMA COLABORATIVA I				E0251377											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
122	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD022369	T01	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES				E0220478	Assinado	359.00002240/2023-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
123	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD024233	T0	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO				E0240354	Assinado	359.00006632/2025-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
124	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD024068	T01	Ativo		2025-03-21 03:00:00	2026-03-20 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM				E0240099	28/11 - Em negocia????o com o cliente	359.00001593/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
125	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD022250	T03	Ativo		2025-10-31 03:00:00	2026-10-30 03:00:00	\N	6313.44	0.00	0.00	6313.44	0.00	SAM PATRIMONIO				E0220329											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
126	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD023262	T01	Ativo		2024-09-14 03:00:00	2025-09-13 03:00:00	\N	79054.75	6805.28	0.00	72249.47	0.00	NUVEM PUBLICA				E0230300	Assinado	359.0000.7362/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
127	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD023262	T03	Ativo		2025-09-14 03:00:00	2026-09-13 03:00:00	\N	79054.75	6805.28	0.00	72249.47	0.00	NUVEM PUBLICA				E0230300											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
128	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD251164	T0	Ativo		2025-10-28 03:00:00	2028-04-27 03:00:00	\N	6055.90	0.00	0.00	6055.90	0.00	SAM ESTOQUE E PATRIMONIO - CARGA ADICIONAL				E0251284											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
129	MARTA MARIA NOVAES DE ALC??NTARA	CIA DO METROPOLITANO DE SAO PAULO	METR??	PD025142	T0	Ativo		2025-04-16 03:00:00	2028-04-15 03:00:00	\N	95370374.14	29909811.39	0.00	65460562.75	0.00	PaaS MIDDLEWARE				E0250164											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
130	PAULO MARCELLO DA SILVA FERREIRA	CONSELHO DE ARQUITETURA E URBANISMO DO BRASIL	CAU - BR	PD025181	T0	Ativo		2025-05-23 03:00:00	2028-05-22 03:00:00	\N	5595394.46	621710.48	0.00	4973683.98	0.00	PaaS MIDDLEWARE				E0250210											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
131	JUNEIDY SOLANGE BETECA JONY	AGENCIA SAO PAULO DE DESENVOLVIMENTO - ADE SAMPA	ADESAMPA	PD025206		Ativo		2025-06-03 03:00:00	2028-06-02 03:00:00	\N	7381653.75	1904261.13	0.00	5477392.62	0.00	PAAS MIDDLEWARE				E0250241											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
132	NADIA BERTUCCELLI	MUNICIPIO DE SERRANA	SERVI??OS PREFEITURAS	PD023654	T0	Ativo		2023-06-04 03:00:00	2028-06-03 03:00:00	\N	345192.98	58171.10	0.00	287021.88	0.00	PREFEITURA - CADASTRO				E0230654											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
133	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD025202	T0	Ativo		2025-07-28 03:00:00	2028-07-27 03:00:00	\N	26221921.62	873680.34	0.00	25348241.28	0.00	MIDDLEWARE, NUVEM P??BLICA, PLATAFORMA PaaS , E-MAIL, COLABORA????O E PRODUTIVIDADE				E0250236		359.00003457/2025-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
134	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD023085	T0	Ativo		2023-08-01 03:00:00	2028-07-31 03:00:00	\N	150321835.91	32987997.92	0.00	117333837.99	0.00	NUVEM PUBLICA				E0230097		359.00002916/2023-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
135	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD025165	T0	Ativo		2025-06-08 03:00:00	2028-08-05 03:00:00	\N	1402877.64	467625.88	0.00	935251.76	0.00	PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0250191											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
136	DAIANE DA SILVA SOUZA	MUNICIPIO DE COTIA	SERVI??OS PREFEITURAS	PD023655	T0	Ativo		2023-09-15 03:00:00	2028-09-14 03:00:00	\N	10368000.00	2053196.73	0.00	8314803.27	0.00	PREFEITURA - CADASTRO				E0230655											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
137	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD025222	T0	Ativo		2025-07-01 03:00:00	2028-06-30 03:00:00	\N	148413600.71	21483232.76	0.00	126930367.95	0.00	SOLU??AO INTEGRADA - CRM E ITSM + OUTSOURCING				E0250261		359.00004764/2025-71									2025-12-09 17:19:01.908	2025-12-15 14:57:44.926
138	JUNEIDY SOLANGE BETECA JONY	FUNDACAO CARLOS ALBERTO VANZOLINI	FCAV	PD022071	T03	Ativo		2025-04-01 03:00:00	2026-03-31 03:00:00	\N	114946.60	56364.00	0.00	58582.60	0.00	INFRAESTRUTURA				E0220095		359.00001322/2023-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
139	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	PD023046	T02	Ativo		2025-05-01 03:00:00	2026-04-30 03:00:00	\N	84182.40	37303.20	0.00	46879.20	0.00	NUVEM				E0230055		359.00000025/2023-49 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
140	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	PD025108	T0	Ativo		2025-05-01 03:00:00	2026-04-30 03:00:00	\N	85985.76	42992.88	0.00	42992.88	0.00	OFFICE				E0250124		359.00000734/2025-96									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
141	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ZERBINI	FZ	PD023016	T0	Ativo		2023-01-02 03:00:00	2025-01-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADO DIGITAL eCPF				E0230019	Contrato Encerrado							PD024144			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
142	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD023331	T0	Ativo		2024-01-01 03:00:00	2025-12-31 03:00:00	\N	4053040.93	2317295.82	0.00	1735745.11	0.00	MANUTEN????O SISTEMAS LPIE , SIC-CEL - SAM ESTOQUE- SAM PATRIMONIO				E0230402\nE0230403	04.12 - Aguardo disponibiliza????o do bloco	359.00008975/2023-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
143	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD021041	T02	Ativo		2025-10-07 03:00:00	2026-10-06 03:00:00	\N	430924.56	4730.09	0.00	426194.47	0.00	DESKTOP B??SICO e  AVAN??ADO				E0210055											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
144	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD023407	T02	Ativo		2025-10-26 03:00:00	2026-10-25 03:00:00	\N	1360.80	18.60	0.00	1342.20	0.00	PROGRAMA SP SEM PAPEL				E0230502											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
145	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD251420	T0	Ativo		2025-11-04 03:00:00	2026-11-03 03:00:00	\N	88761.00	0.00	0.00	88761.00	0.00	PLATAFORMA COLABORATIVA I				E0251529											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
146	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE ARUJA	PREFEITURA	PD251136	T0	Ativo	\N	2025-08-14 09:00:00	2026-08-13 09:00:00	\N	182664.00	45666.00	0.00	136998.00	0.00	OFFICE	\N	\N	\N	E0251240	\N	359.00004083/2025-11	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
153	JUNEIDY SOLANGE BETECA JONY	SECRETARIA MUNICIPAL DAS SUBPREFEITURAS	SMSUB	PD023049	T01	Ativo		2024-06-21 03:00:00	2025-06-20 03:00:00	\N	144293.90	56145.91	0.00	88147.99	0.00	SISTEMA INTEGRADO DE MULTAS -SIM - CONSULTA DE RESTRI????O VEICULAR				E0230058	Assinado	359.00004125/2024-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
154	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024190	T0	Ativo		2024-07-10 03:00:00	2025-07-09 03:00:00	\N	200.35	60.98	0.00	139.37	0.00	PROGRAMA SP SEM PAPEL				E0240308	Assinado	359.00005416/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
155	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024008	T0	Ativo		2024-08-06 03:00:00	2025-08-05 03:00:00	\N	4808395.68	864673.43	0.00	3943722.25	0.00	INFRAESTRUTURA				E0240008\nET240008	Assinado	359.00005501/2023-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
156	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024225	T0	Ativo		2024-09-20 03:00:00	2025-09-19 03:00:00	\N	1322257.60	151695.75	0.00	1170561.85	0.00	SUSTENTA????O DO SISTEMA PARA SPI				E0240341\nE0240342\nE0240343	Assinado	359.00006289/2024-97									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
157	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD024250	T0	Ativo		2024-09-27 03:00:00	2025-09-26 03:00:00	\N	4565807.52	179093.85	0.00	4386713.67	0.00	NUVEM PRODESP				E0240379	Assinado	359.00008646/2024-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
164	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024225	T01	Ativo		2025-09-20 03:00:00	2026-09-19 03:00:00	\N	1322257.60	151695.75	0.00	1170561.85	0.00	HOSPEDAGEM VIRTUALIZADA ON PREMISES GERENCIADA DO SITE PARA SPI				E0240343											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
165	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024225	T01	Ativo		2025-09-20 03:00:00	2026-09-19 03:00:00	\N	1322257.60	151695.75	0.00	1170561.85	0.00	SUSTENTA????O DO SISTEMA PARA SPI				E0240341											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
166	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD023333	T02	Ativo		2025-10-02 03:00:00	2026-10-01 03:00:00	\N	8535.36	711.28	0.00	7824.08	0.00	SAM ESTOQUE E PATRIMONIO				E0230405											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
168	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD024405	T0	Ativo		2025-08-09 03:00:00	2028-03-07 03:00:00	\N	58346.36	3240.58	0.00	55105.78	0.00	SAM ESTOQUE E PATRIMONIO				E0240562											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
169	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PROMISSAO	SERVI??OS PREFEITURAS	PD023618	T02	Ativo		2023-03-20 03:00:00	2028-03-19 03:00:00	\N	49507.20	6119.64	0.00	43387.56	0.00	PREFEITURA - CADASTRO				E0230618		359.00006067/2024-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
170	DAIANE DA SILVA SOUZA	MUNICIPIO DE PEREIRA BARRETO	SERVI??OS PREFEITURAS	PD022573	T03	Ativo		2025-10-27 03:00:00	2027-10-26 03:00:00	\N	55392.00	0.00	0.00	55392.00	0.00	PREFEITURA CADASTRO				E0220573											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
171	AMANDA ESTEVES	MUNICIPIO DA ESTANCIA TURISTICA DE IBITINGA	SERVI??OS PREFEITURAS	PD251639	T0	Ativo		2025-11-01 03:00:00	2027-10-31 03:00:00	\N	154656.00	0.00	0.00	154656.00	0.00	PREFEITURA CADASTRO				E0251752		359.00010447/2025-94									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
172	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023271	T02	Ativo		2025-11-01 03:00:00	2027-10-31 03:00:00	\N	7792788.62	0.00	0.00	7792788.62	0.00	PROCESSAMENTO IBM, ARMAZENAMENTO E RETEN????O DE DADOS				E0230310											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
173	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024214	T01	Ativo		2025-11-22 03:00:00	2027-02-21 03:00:00	\N	28587.00	0.00	0.00	28587.00	0.00	SAM ESTOQUE				E0240288											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
174	JUNEIDY SOLANGE BETECA JONY	AGENCIA PAULISTA DE PROMOCAO DE INVESTIMENTOS E COMPETITIVIDADE - INVESTE SAO PAULO	INVESTE SP	PD251263	T0	Ativo		2025-11-01 03:00:00	2027-10-31 03:00:00	\N	3544.56	0.00	0.00	3544.56	0.00	PLATAFORMA COLABORATIVA I				E0251365											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
175	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD024169	T02	Ativo		2025-11-01 03:00:00	2027-10-31 03:00:00	\N	67847.71	0.00	0.00	67847.71	0.00	PROGRAMA SP SEM PAPEL				E0240277											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
176	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO CONSERV PROD FLORESTAL EST SP	FUND. FLORESTAL	PD251388	T0	Ativo		2025-11-12 03:00:00	2027-11-11 03:00:00	\N	83556.83	0.00	0.00	83556.83	0.00	MIDDLEWARE				E0251576											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
177	AMANDA ESTEVES	MUNICIPIO DE TREMEMBE	SERVI??OS PREFEITURAS	PD251630	T0	Ativo		2025-11-14 03:00:00	2027-11-13 03:00:00	\N	128880.00	0.00	0.00	128880.00	0.00	PREFEITURA CADASTRO				E0251743											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
159	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE GUARULHOS	PREFEITURA	PD023392	T01	Ativo	\N	2024-10-14 09:00:00	2025-10-13 09:00:00	\N	59892.00	1359.32	0.00	58532.68	0.00	NUVEM P??BLICA	\N	\N	\N	E0230479	Assinado	??359.00007273/2023-11	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
163	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE PORTO FELIZ	PREFEITURA	PD022383	T0	Ativo	\N	2023-03-23 09:00:00	2026-03-22 09:00:00	\N	294030.00	38012.50	0.00	256017.50	0.00	DaaS	\N	\N	\N	E0220497	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
160	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE ITUPEVA	PREFEITURA	PD022337	T02	Ativo	\N	2024-12-13 09:00:00	2025-12-12 09:00:00	\N	516109.20	455896.46	0.00	60212.74	0.00	OFFICE BASICO-INTERMEDIARIO	\N	\N	\N	E0220438	09/12 - Na GJU	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
167	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE GUARULHOS	PREFEITURA	PD023392	T02	Ativo	\N	2025-10-14 09:00:00	2026-10-13 09:00:00	\N	59892.00	1359.32	0.00	58532.68	0.00	NUVEM P??BLICA	\N	\N	\N	E0230479	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
158	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MACATUBA	PREFEITURA	PD024343	T0	Ativo	\N	2024-10-13 09:00:00	2025-10-12 09:00:00	\N	94058.52	94058.52	0.00	0.00	0.00	EMAIL COMO SERVI??O  E  OFFICE BASICO	\N	\N	\N	E0240487	Assinado (Renovado no PD251485)	35900007143/2024-69\n359.00008848/2025-84	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
151	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE CUBATAO	PREFEITURA	PD023245	T01	Ativo	\N	2024-06-22 09:00:00	2025-06-21 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO	\N	\N	\N	E0230277	Assinado (Renovado no PD251144)	359.00003049/2023-50	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
147	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE CANAS	PREFEITURA	PD023434	T0	Ativo	\N	2024-01-07 09:00:00	2025-01-06 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O	\N	\N	\N	E0230537	Assinado	359.00009753/2024-05	\N	\N	\N	\N	\N	PD024492	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
152	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MACATUBA	PREFEITURA	PD0251485	T0	Ativo	\N	2025-10-14 09:00:00	2026-10-13 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE	\N	\N	\N	E0251599	\N	359.00008848/2025-84	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
178	JUNEIDY SOLANGE BETECA JONY	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	ITESP	PD024247	T01	Ativo		2025-11-21 03:00:00	2027-11-20 03:00:00	\N	26576.88	0.00	0.00	26576.88	0.00	SAM ESTOQUE E PATRIMONIO				E0240377											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
179	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MIRASSOL	SERVI??OS PREFEITURAS	PD251604	T0	Ativo		2025-11-26 03:00:00	2027-11-25 03:00:00	\N	64440.00	0.00	0.00	64440.00	0.00	PREFEITURA CADASTRO				E0251719											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
180	AMANDA ESTEVES	MUNICIPIO DE TANABI	SERVI??OS PREFEITURAS	PD251605	T0	Ativo		2025-11-27 03:00:00	2027-11-26 03:00:00	\N	15465.60	0.00	0.00	15465.60	0.00	PREFEITURA CADASTRO				E0251720											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
181	DAIANE DA SILVA SOUZA	MUNICIPIO  DE JACUPIRANGA	SERVI??OS PREFEITURAS	PD022588	T04	Ativo		2025-11-29 03:00:00	2027-11-28 03:00:00	\N	16632.00	0.00	0.00	16632.00	0.00	PREFEITURA CADASTRO				E0220588											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
182	NADIA BERTUCCELLI	RP MOBI EMPRESA DE MOBILIDADE URBANA DE RIBEIRAO PRETO	SERVI??OS PREFEITURAS	PD024715	T01	Ativo		2025-12-10 03:00:00	2027-12-09 03:00:00	\N	4424400.00	0.00	0.00	4424400.00	0.00	PREFEITURA CADASTRO				E0240715											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
183	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD025249	T0	Ativo		2025-10-06 03:00:00	2028-04-05 03:00:00	\N	19304365.80	0.00	0.00	19304365.80	0.00	SUPORTE DE CHAMADOS TECNICOS + ITSM				E0250302											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
184	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD023108	T01	Ativo		2025-10-31 03:00:00	2028-04-29 03:00:00	\N	20988.00	0.00	0.00	20988.00	0.00	PROGRAMA SP SEM PAPEL				E0230127											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
185	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD024401	T0	Ativo		2025-11-13 03:00:00	2028-05-12 03:00:00	\N	54822367.80	0.00	0.00	54822367.80	0.00	CIBERSEGURAN??A				E0240557											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
186	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD251205	T0	Ativo		2025-09-18 03:00:00	2028-09-17 03:00:00	\N	314641.08	0.00	0.00	314641.08	0.00	NUVEM PUBLICA				E0251401											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
187	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD025179	T0	Ativo		2025-10-31 03:00:00	2028-10-30 03:00:00	\N	12550665.44	0.00	0.00	12550665.44	0.00	PAAS MIDDLEWARE				E0250207											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
188	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD025288	T0	Ativo		2025-11-01 03:00:00	2028-10-31 03:00:00	\N	81000000.00	0.00	0.00	81000000.00	0.00	NUVEM PUBLICA, PAAS MIDDLEWARE E PLATAFORMA COLABORATIVA				E0250352		359.00006969/2025-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
189	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PDC24354	T0	Ativo		2025-11-01 03:00:00	2028-10-31 03:00:00	\N	23146130.97	0.00	0.00	23146130.97	0.00	NUVEM PUBLICA				E0250327											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
190	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD251365	T0	Ativo		2025-12-02 03:00:00	2028-12-01 03:00:00	\N	495072.00	0.00	0.00	495072.00	0.00	NUVEM PRODESP				E0251472											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
191	DAIANE DA SILVA SOUZA	MUNICIPIO DE URUPES	SERVI??OS PREFEITURAS	PD024711	T01	Ativo		2025-11-27 03:00:00	2029-11-26 03:00:00	\N	85449.60	0.00	0.00	85449.60	0.00	PREFEITURA SIM				E0240711											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
192	DAIANE DA SILVA SOUZA	MUNICIPIO DE NATIVIDADE DA SERRA	SERVI??OS PREFEITURAS	PD025016	T01	Ativo		2025-12-02 03:00:00	2029-12-01 03:00:00	\N	51552.00	0.00	0.00	51552.00	0.00	PREFEITURA CADASTRO				E0250020											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
193	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE LARANJAL PAULISTA	SERVI??OS PREFEITURAS	PD024696	T01	Ativo		2025-12-13 03:00:00	2029-12-12 03:00:00	\N	128880.00	0.00	0.00	128880.00	0.00	PREFEITURA CADASTRO				E0240696											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
194	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD022426	T01	Ativo		2024-01-02 03:00:00	2025-01-01 03:00:00	\N	1132.71	0.00	0.00	1132.71	0.00	PROGRAMA SP SEM PAPEL				E0220862	Assinado	359.00008571/2023-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
195	NADIA BERTUCCELLI	MUNICIPIO DE CAMPOS DO JORDAO	SERVI??OS PREFEITURAS	PD024601	T0	Ativo		2024-01-02 03:00:00	2025-01-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240601	Assinado (Renovado no PD025081)	359.00000384/2025-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
196	AMANDA ESTEVES	MUNICIPIO DE VARGEM GRANDE PAULISTA	SERVI??OS PREFEITURAS	PD024602	T0	Ativo		2024-01-02 03:00:00	2025-01-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0240602	Assinado  (Renovado no PD025147)	359.00001808/2025-10						PD025147			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
197	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE LUCELIA	SERVI??OS PREFEITURAS	PD020750	T04	Ativo		2024-01-03 03:00:00	2025-01-02 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200750	Assinado  (Renovado no PD025062)	359.00011381/2024-79						PD025062			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
198	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAJURU	SERVI??OS PREFEITURAS	PD024608	T0	Ativo		2024-01-03 03:00:00	2025-01-02 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240608	Assinado	359.00011343/2024-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
199	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD023281	T0	Ativo		2024-01-04 03:00:00	2025-01-03 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADO DIGITAL eCPF - eCNPJ				E0230320	Assinado (Renovado no PD024408)	359.00000775/2024-00						PD024408			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
200	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE MEIO AMBIENTE INFRAESTRUTURA E LOGISTICA	SEMIL	PD023058	T0	Ativo		2024-01-05 03:00:00	2025-01-04 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO				E0230067	Assinado (Renovado no PD025053)	359.00011284/2024-86						PD025053			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
201	DAIANE DA SILVA SOUZA	MUNICIPIO DE PRAIA GRANDE	SERVI??OS PREFEITURAS	PD024676	T01	Ativo		2025-09-10 03:00:00	2026-09-09 03:00:00	\N	2095428.84	199572.79	0.00	1895856.05	0.00	PREFEITURA - CADASTRO				E0240676		359.00007136/2024-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
202	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD251281	T0	Ativo		2025-12-01 03:00:00	2027-11-30 03:00:00	\N	150768.00	0.00	0.00	150768.00	0.00	PLATAFORMA COLABORATIVA I				E0251385											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
203	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023111	T03	Ativo		2024-09-12 03:00:00	2025-01-11 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MANUTEN????O DOS SISTEMAS DE LAUDOS PERICIAIS -LAUDOS TJ  E APOIO OPERACIONAL				E0230130	Cliente n??o quis dar continuidade ao contrato.	359.00000166/2023-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
204	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023113	T02	Ativo		2024-09-12 03:00:00	2025-01-11 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MANUTEN????O  DO SISTEMA DE LAUDOS CARACTERIZADORES DE DEFICI??NCIA - ISEN????O IPVA				E0230132	Cliente n??o quis dar continuidade ao contrato.	359.00000168/2023-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
205	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD022448	T02	Ativo		2024-07-17 03:00:00	2025-01-16 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESENVOLVIMENTO DE SISTEMAS				E0220891	Assinado	359.0000.3351/2023-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
206	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE DESENVOLVIMENTO SOCIAL	SEDS	PD019177	T05	Ativo		2024-10-18 03:00:00	2025-01-17 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROGRAMA SP SEM PAPEL				E0190233	Assinado	359.00008853/2024-14						PD024496			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
207	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BOTUCATU	SERVI??OS PREFEITURAS	PD019825	T04	Ativo		2024-01-20 03:00:00	2025-01-19 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0190825	Assinado  	359.00000537/2025-77						PD025099			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
208	NADIA BERTUCCELLI	MUNICIPIO DE ITAI	SERVI??OS PREFEITURAS	PD020788	T03	Ativo		2024-01-20 03:00:00	2025-01-19 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200788	Assinado  	359.00001806/2025-12						PD025146			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
209	DAIANE DA SILVA SOUZA	MUNICIPIO DE JAGUARIUNA	SERVI??OS PREFEITURAS	PD023683	T0	Ativo		2024-01-20 03:00:00	2025-01-19 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0230683	Assinado  	359.00010348/2024-21						PD025017			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
210	AMANDA ESTEVES	MUNICIPIO DE BOCAINA	SERVI??OS PREFEITURAS	PD019835	T04	Ativo		2024-01-27 03:00:00	2025-01-26 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0190835	Assinado  	359.00000581/2025-87						???PD025100			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
211	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD024072	T0	Ativo		2024-08-30 03:00:00	2025-01-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HIPER AUTOMA????O				E0240107	Assinado	359.00009813/2023-09						PD025043			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
212	AMANDA ESTEVES	MUNICIPIO DE GUARUJA	SERVI??OS PREFEITURAS	PD019805	TI-2025	Ativo		2024-11-27 03:00:00	2025-01-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0190805	Assinado (Renovado no PD251036 )	359.00002633/2025-50						PD251036			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
213	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD021266	TI-2025	Ativo		2024-12-30 03:00:00	2025-01-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PaaS MIDDLEWARE (Rem??dio em casa)				E0210330	INDENIZAT??RIO	359.00000422/2024-00									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
214	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD023475	T0	Ativo		2024-02-01 03:00:00	2025-01-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PAAS MIDDLEWARE COM SERVI??OS  DE GEST??O				E0230598	Assinado	35900011056/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
215	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PDC23036	T0	Ativo		2024-02-01 03:00:00	2025-01-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	INFRAESTRUTURA FISICA PARA A UNIDADE REGIONAL DE PESQUISA E DESENVOLVIMENTO DE PARIQUERA-A??U				EC230043	Contrato Encerrado	359.00007072/2023-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
217	NADIA BERTUCCELLI	MUNICIPIO DE MONTE ALTO	SERVI??OS PREFEITURAS	PD020741	T04	Ativo		2024-02-04 03:00:00	2025-02-03 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200741	Assinado  	359.00011512/2024-18						PD025064			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
218	DAIANE DA SILVA SOUZA	MUNICIPIO DE JUNQUEIROPOLIS	SERVI??OS PREFEITURAS	PD019658	T04	Ativo		2024-02-06 03:00:00	2025-02-05 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0190658	Assinado  	359.00000929/2025-36						PD025124			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
219	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE DESENVOLVIMENTO SOCIAL	SEDS	PD022422	T02	Ativo		2024-11-07 03:00:00	2025-02-06 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVICO				E0220858	Assinado	359.00007478/2024-87\n359.00007573/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
220	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD024064	T0	Ativo		2024-02-09 03:00:00	2025-02-08 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	INFRAESTRUTURA FISICA				E0240094	Contrato Encerrado	359.00001331/2024-83									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
221	DAIANE DA SILVA SOUZA	MUNICIPIO DE REGISTRO	SERVI??OS PREFEITURAS	PD020766	T04	Ativo		2024-06-24 03:00:00	2025-02-10 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200766	Assinado  	359.00008763/2024-15						PD024646			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
222	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IPAUSSU	SERVI??OS PREFEITURAS	PD023607	T01	Ativo		2024-02-13 03:00:00	2025-02-12 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0230607	Assinado  	359.00001485/2025-56						PD025141			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
223	DAIANE DA SILVA SOUZA	MUNICIPIO DE MOCOCA	SERVI??OS PREFEITURAS	PD020807	T03	Ativo		2024-02-15 03:00:00	2025-02-14 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200807	Assinado  	359.00001730/2025-25						PD025145			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
224	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD021006	T01	Ativo		2024-02-16 03:00:00	2025-02-15 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESKTOP COMO SERVI??O - DaaS				E0210007	CLIENTE PERDEU O PRAZO, contrato ser?? renovado	359.00001559/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
225	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD022329	T02	Ativo		2024-08-16 03:00:00	2025-02-15 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PONTO CONFERENCIA DIGITAL  E OFFICE BASICO				E0220428	Assinado	359.00000906/2024-41						PD024445			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
226	JUNEIDY SOLANGE BETECA JONY	TRILOGIC TECNOLOGIA LTDA	TRILOGIC	PD023076	T01	Ativo		2024-02-17 03:00:00	2025-02-16 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CARIMBO DE TEMPO				E0230088	Assinado	359.00000186/2024-13						PD025231			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
227	JUNEIDY SOLANGE BETECA JONY	FUNDACAO HEMOCENTRO DE RIBEIRAO PRETO	FUNDHERP	PD024022	T0	Ativo		2024-01-26 03:00:00	2025-01-25 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROGRAMA SP SEM PAPEL				E0240027	Assinado	359.000010635/2024-31						PD025228			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
229	KARINA FREIRE GRANDA SALLES	EMAE - EMPRESA METROPOLITANA DE AGUAS E ENERGIA SA	EMAE	PD211011	T02	Ativo		2024-02-17 03:00:00	2025-02-16 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	ASSINA.SP				E0211011	27/02/2025 - DEMANDA CANCELADA, CLIENTE NAO TEM INTERESSE NA PRORROGA????O	35900000771/2024-13\n35900000385/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
230	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD021032	T02	Ativo		2023-11-18 03:00:00	2025-02-17 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SAM M??DULO ESTOQUE.				E0210043	Assinado	359.00010602/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
231	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD022036	T01	Ativo		2024-02-27 03:00:00	2025-02-26 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROCESSAMENTO IBM				E0220047	Assinado (Renovado no PD025061)	359.00002221/2024-39						PD025061			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
232	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD021354	T03	Ativo		2024-10-28 03:00:00	2025-02-27 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	FOLHA PAGAMENTO				E0210464	Assinado (Renovado no PD024309)	359.00005570/2023-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
233	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD023032		Ativo		2024-03-01 03:00:00	2025-02-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HELP DESK				E0230039	Assinado	359.00001794/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
234	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD023184	T0	Ativo		2024-12-31 03:00:00	2025-02-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO - INTERMEDIARIO				E0230212	Renovado no PD025007	359.0000.7698/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
236	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD020331	T0	Ativo		2022-03-02 03:00:00	2025-03-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MIDDLEWARE				E0200428	Renovado no PD025165 										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
235	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD020223	T01	Encerrado	\N	2024-03-02 03:00:00	2025-03-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESKTOP COMO SERVICO - DaaS BASIC	\N	\N	\N	E0200289	Contrato Encerrado	359.00001926/2024-39	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
228	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE PONTAL	PREFEITURA	PD023445	T0	Ativo	\N	2024-01-31 09:00:00	2025-01-30 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO	\N	\N	\N	E0230551	Assinado (renovado no PD025072)	359.00002783/2024-82	\N	\N	\N	\N	\N	PD025072	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
237	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO VICENTE	SERVI??OS PREFEITURAS	PD020742	T04	Ativo		2024-03-05 03:00:00	2025-03-04 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200742	Assinado  	359.00001268/2025-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
238	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD023339	T0	Ativo		2024-03-07 03:00:00	2025-03-06 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SUPORTE TECNICO TI				E0230411	Contrato Encerrado	359.00003323/2023-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
239	MARIA REGINA FUNICELLO	BANCO RENDIMENTO S.A.	RENDIMENTO	PD022287	T01	Ativo		2024-03-08 03:00:00	2025-03-07 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HOSPEDAGEM DE ROTEADORES				E0220379	Assinado	359.00002153/2024-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
240	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD022034	T03	Ativo		2024-11-21 03:00:00	2025-03-09 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	F??BRICA DE SOFTWARE				E0220045	Assinado	359.00001180/2023-82									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
241	DAIANE DA SILVA SOUZA	MUNICIPIO DE TATUI	SERVI??OS PREFEITURAS	PD022802	T02	Ativo		2024-03-15 03:00:00	2025-03-14 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0220802	Assinado  	359.00002514/2025-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
242	MARIA REGINA FUNICELLO	IMPRENSA OFICIAL DE SERGIPE - IOSE	IOSE	PD023138	T0	Ativo		2023-03-17 03:00:00	2025-03-16 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADOS AR				E0230163	Assinado (Renovado no PD025188)	359.00003568/2024-07									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
243	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD023266	T01	Ativo		2024-09-20 03:00:00	2025-03-19 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SAM ESTOQUE				E0230304	Assinado (Renovado no PD025024)	359.00006519/2023-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
244	AMANDA ESTEVES	PROGRESSO E DESENVOL MUNICIPAL-OLIMPIA	SERVI??OS PREFEITURAS	PD024685	T02	Ativo		2024-12-27 03:00:00	2025-03-26 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240685	Bloqueado desde do dia 27/03/25 - Est?? sem contrato vigente.	359.00007495/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
245	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD023243	T0	Ativo		2024-03-27 03:00:00	2025-03-26 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PUBLICA				E0230275	Assinado (Renovado no PD025041)	359.00002762/2024-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
246	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD018077	TI-2024	Ativo		2023-01-29 03:00:00	2025-03-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PRODESP				EC180101	Contrato Encerrado										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
247	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD021117	TI-2024	Ativo		2024-07-10 03:00:00	2025-03-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SOLU????O BIG DATA				E0210278	Contrato Encerrado										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
249	FRANCINE TANIGUCHI FALLEIROS DIAS	SUPERINTENDENCIA DA POLICIA TECNICO-CIENTIFICA	SPTC	PD023310	T02	Ativo		2025-01-01 03:00:00	2025-03-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O, OFFICE B??SICO E INTERMEDI??RIO				E0230380	Assinado (Renovado no PD024385)	359.00007833/2023-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
250	DAIANE DA SILVA SOUZA	MUNICIPIO DE PIRAJU	SERVI??OS PREFEITURAS	PD023624	T01	Ativo		2024-04-03 03:00:00	2025-04-02 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0230624	Assinado  	359.00002543/2025-69									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
251	DAIANE DA SILVA SOUZA	MUNICIPIO DE CABREUVA	SERVI??OS PREFEITURAS	PD024687	T02	Ativo		2025-09-10 03:00:00	2026-09-09 03:00:00	\N	260280.00	26995.40	0.00	233284.60	0.00	PREFEITURA CADASTRO				E0240687											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
252	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD023223	T0	Ativo		2024-03-21 03:00:00	2025-03-20 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PLATAFORMA DOCUMENTAL COMO SERVI??O				E0230254	Contrato Encerrado	359.00009207/2023-85									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
253	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD024068	T0	Ativo		2024-03-21 03:00:00	2025-03-20 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PUBLICA				E0240099	Assinado	359.00001593/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
255	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD020034	T04	Ativo		2024-03-02 03:00:00	2025-03-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O				E0200044	Assinado (Renovado no PD025002)	359.00000897/2024-98									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
256	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD020334	T0	Ativo		2022-04-06 03:00:00	2025-04-05 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SOLU????O DE CONECTIVIDADE E SEGURAN??A - MIDDLEWARE, PROCESSAMENTO EM NUVEM P??BLICA				E0200432	Renovado no PD025199 	359.00003892/2025-06									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
257	DAIANE DA SILVA SOUZA	MUNICIPIO DE JUQUITIBA	SERVI??OS PREFEITURAS	PD023620	T01	Ativo		2024-04-09 03:00:00	2025-04-08 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0230620	Assinado  	359.00003504/2025-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
258	KARINA FREIRE GRANDA SALLES	EMAE - EMPRESA METROPOLITANA DE AGUAS E ENERGIA SA	EMAE	PD023043	T0-T1	Ativo		2023-04-10 03:00:00	2025-04-09 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADO DIGITAL eCPF				E0230052	Contrato Encerrado	359.00002520/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
259	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD023361	T0	Ativo		2024-04-12 03:00:00	2025-04-11 03:00:00	\N	82200.00	0.00	0.00	82200.00	0.00	SMTP				E0230439	Assinado	359.00004624/2023-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
260	MARTA MARIA NOVAES DE ALC??NTARA	CIA DO METROPOLITANO DE SAO PAULO	METR??	PD023318	T0	Ativo		2024-04-17 03:00:00	2025-04-16 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O - OFFICE  BASICO				E0230389	Assinado (Renovado no PD025058)	359.00002326/2024-98									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
261	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD023106	T01	Ativo		2024-04-19 03:00:00	2025-04-18 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PUBLICA				E0230125	Assinado (Renovado no PD025175)	359.00000870/2024-03									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
262	JUNEIDY SOLANGE BETECA JONY	BRASIL IOT SEG. DA INFORMACAO LTDA	BRASIL IOT	PD024131	T0	Ativo		2024-04-25 03:00:00	2025-04-24 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CARIMBO DO TEMPO				E0240227	Virou novo contrato	359.00002393/2024-11						PD251325			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
263	DAIANE DA SILVA SOUZA	MUNICIPIO DE PANORAMA	SERVI??OS PREFEITURAS	PD023645	T01	Ativo		2024-04-28 03:00:00	2025-04-27 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0230645	Assinado  	359.00004835/2025-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
264	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD024174	T01	Ativo		2024-10-29 03:00:00	2025-04-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SERVI??OS DE SUPORTE T??CNICO LOCAL, SERVI??OS DE CENTRAL DE ATENDIMENTO (HELP DESK/SERVICE DESK) E  SERVI??OS DE PROCESSAMENTO DE DADOS EM MAINFRAME UNISYS NO DATA CENTER PRODESP				E0240284	Assinado	359.00003267/2024-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
265	MARIA REGINA FUNICELLO	BANCO  DAYCOVAL S.A.	DAYCOVAL	PD024094	T0	Ativo		2024-04-30 03:00:00	2025-04-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HOSPEDAGEM FISICA  DE  EQUIPAMENTOS				E0240143	Assinado (Renovado no PD025107)	359.00003264/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
254	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MOGI DAS CRUZES	PREFEITURA	PD023404	T01	Ativo	\N	2024-12-06 09:00:00	2025-02-28 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO	\N	\N	\N	E0230495	Contrato Renovado	359.00000239/2025-87	\N	\N	\N	\N	\N	PD025075	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
266	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD020322	T01	Ativo		2024-05-01 03:00:00	2025-04-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROCESSAMENTO EM MAINFRAME				E0200417	Assinado (Renovado no PD024118)	359.00008923/2023-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
267	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD022448	T03	Ativo		2025-01-17 03:00:00	2025-04-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESENVOLVIMENTO DE SISTEMAS				E0220891	Assinado	359.00003351/2023-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
268	NADIA BERTUCCELLI	MUNICIPIO DE ELDORADO	SERVI??OS PREFEITURAS	PD021724	T03	Ativo		2024-05-04 03:00:00	2025-05-03 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0210724	Assinado  	359.00003996/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
269	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITAPIRA	SERVI??OS PREFEITURAS	PD024627	T0	Ativo		2024-05-09 03:00:00	2025-05-08 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0240627	Assinado  	359.00003588/2025-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
270	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD023125	T0	Ativo		2023-05-10 03:00:00	2025-05-09 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADO DIGITAL eCPF				E0230148	Assinado (Renovado no PD025036)	359.00000343/2023-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
271	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD023464	T0	Ativo		2024-05-10 03:00:00	2025-05-09 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PUBLICA COM SUPORTE AVANCADO - DATA LAKE E  EVOLU????O PARA O ANALYTICS E AL				E0230581	Assinado (Renovado no PD025131)	359.00007942/2023-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
272	NADIA BERTUCCELLI	MUNICIPIO DE TABAPUA	SERVI??OS PREFEITURAS	PD022524	T02	Ativo		2024-05-15 03:00:00	2025-05-14 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0220524	Assinado  	359.00003153/2025-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
273	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD021338	T01	Ativo		2024-11-18 03:00:00	2025-05-17 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES				E0210443	Contrato Encerrado	359.00000296/2025-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
274	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PEDREGULHO	SERVI??OS PREFEITURAS	PD022536	T02	Ativo		2024-05-20 03:00:00	2025-05-19 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0220536	Contrato Encerrado	N??o encontrado									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
275	AMANDA ESTEVES	MUNICIPIO DE BARRETOS	SERVI??OS PREFEITURAS	PD022508	T02	Ativo		2024-05-25 03:00:00	2025-05-24 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0220508	Assinado	359.00004911/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
276	NADIA BERTUCCELLI	MUNICIPIO DE BEBEDOURO	SERVI??OS PREFEITURAS	PD022507	T02	Ativo		2024-05-31 03:00:00	2025-05-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0220507	Assinado  	359.00003503/2025-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
277	MARIA REGINA FUNICELLO	BANCO RENDIMENTO S.A.	RENDIMENTO	PD022287	TI-2025	Ativo		2025-03-08 03:00:00	2025-05-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HOSPEDAGEM DE ROTEADORES				E0220379	20/06/2025 - ASSINADO\n\nSEM CONTRATO \n08/03 A 19/06/25	359.00003541/2023-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
278	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	PD023180	TI-2024	Ativo		2024-11-01 03:00:00	2025-04-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0230208	Assinado (Renovado no PD025108)	359.00010992/2024-08									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
279	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD023369	T0	Ativo		2023-12-01 03:00:00	2025-04-14 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE  BASICO				E0230451	Contrato Encerrado	359.00008510/2023-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
281	ANA LIGIA SAPIENZA COLOMBO	FUNDO ESPECIAL DE DESPESA DO MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	FUND. MP	PD023032	T02	Ativo		2025-03-01 03:00:00	2025-05-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	HELP DESK				E0230039	Assinado (Renovado no PD025092)	359.00001794/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
282	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD022437	T0	Ativo		2022-12-08 03:00:00	2025-06-07 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	BI EM NUVEM				E0220877	Assinado	359.00003012/2025-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
283	DAIANE DA SILVA SOUZA	MUNICIPIO DE BIRIGUI	SERVI??OS PREFEITURAS	PD020765	T04	Ativo		2024-06-09 03:00:00	2025-06-08 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200765	Assinado  	359.00003827/2025-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
284	DAIANE DA SILVA SOUZA	MUNICIPIO DE LINS	SERVI??OS PREFEITURAS	PD020762	T04	Ativo		2024-06-10 03:00:00	2025-06-09 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200762	Assinado  	359.00003107/2025-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
285	AMANDA ESTEVES	MUNICIPIO DE MIGUELOPOLIS	SERVI??OS PREFEITURAS	PD021714	T03	Ativo		2024-06-11 03:00:00	2025-06-10 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0210714	Assinado  	359.00004591/2025-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
286	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO - IPT	IPT	PD024166	T0	Ativo		2024-06-12 03:00:00	2025-06-11 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	E MAIL COMO SERVI??O - OFFICE INTERMEDI??RIO				E0240274	Renovado no PD025198 	359.00004369/2024-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
287	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD021195	T02	Ativo		2024-06-14 03:00:00	2025-06-13 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CO-LOCATION VIRTUALIZADO				E0210236	Assinado	359.00005464/2024-29\n2021/00154									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
288	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD023272	T01	Ativo		2024-06-15 03:00:00	2025-06-14 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DAAS NOTEBOOK BASICO - NOTEBOOK ULTRAFINO				E0230311	Contrato Encerrado	359.00002216/2023-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
289	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD021097	T01	Ativo		2024-06-16 03:00:00	2025-06-15 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	Notebook Ultrafino - DaaS Ultrafino.				E0210123	16.06.2025 - Cliente n??o ira prorrogar, est??o licitando os modelo de notebook que precisam, visto que a PRODESP esta sem ata vigente, solicitou que pudessemos manter os equipamentos at?? receberem os novos, o periodo da presta????o de servi??o sem cobertura contratual, ser?? cobrado atrav??s de processo indenizat??rio.\n25.06.2025 - Cobrei Yuri por email, quando respondido anexar email no SEI	359.00005449/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
290	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD022482	T02	Ativo		2024-06-16 03:00:00	2025-06-15 03:00:00	\N	141940.92	0.00	0.00	141940.92	0.00	SISTEMA INTEGRADO DE MULTAS - SIM				E0220948	Assinado	359.00003890/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
291	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO JOAO DA BOA VISTA	SERVI??OS PREFEITURAS	PD024617	T0	Ativo		2024-06-21 03:00:00	2025-06-20 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240617	Renovado no PD251027	359.00002591/2025-57									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
292	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD024352	T0	Ativo		2024-12-23 03:00:00	2025-06-22 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0240498	Assinado (Renovado PD251138)	359.00008690/2023-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
162	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE PONTAL	PREFEITURA	PD025072	T0	Ativo	\N	2025-03-06 09:00:00	2026-03-05 09:00:00	\N	35616.00	23744.00	0.00	11872.00	0.00	OFFICE	\N	\N	\N	E0250086	\N	359.00011710/2024-81	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
293	AMANDA ESTEVES	MUNICIPIO DE TUPA	SERVI??OS PREFEITURAS	PD022526	T02	Ativo		2024-06-26 03:00:00	2025-06-25 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0220526	Foram realizadas tentativas de contato e envio de comunica????es ?? Prefeitura, por??m n??o houve retorno at?? a presente data, o que inviabilizou a continuidade do tr??mite. Solicita????o de bloqueio efetuada.	359.00005806/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
294	JUNEIDY SOLANGE BETECA JONY	FUNDACAO DE PREVIDENCIA COMPLEMENTAR DO ESTADO DE SAO PAULO	PREVCOM	PD024133	T0	Ativo		2024-06-27 03:00:00	2025-06-26 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO				E0240230	Assinado (Renovado no PD251170)	359.00005427/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
295	DAIANE DA SILVA SOUZA	MUNICIPIO DE UBATUBA	SERVI??OS PREFEITURAS	PD024618	T0	Ativo		2024-06-28 03:00:00	2025-06-27 03:00:00	\N	632400.00	0.00	0.00	632400.00	0.00	PREFEITURA - CADASTRO				E0240618	Contrato Assinado	359.00005460/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
296	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD023143	T00	Ativo		2024-06-28 03:00:00	2025-06-27 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE INTERMEDIARIO				E0230168	Assinado	359.00000411/2025-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
297	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD023192	T01	Ativo		2024-06-30 03:00:00	2025-06-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE  BASICO				E0230221	Assinado	359.00000350/2023-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
298	KARINA FREIRE GRANDA SALLES	COMPANHIA PAULISTA DE PARCERIAS - CPP	CPP	PD023230	T01	Ativo		2024-06-30 03:00:00	2025-06-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE INTERMEDI??RIO				E0230262	Assinado	359.00003075/2025-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
299	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD019071	T05	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SERVICOS DE REDE PRIVADA VIRTUAL - VPN				E0190098	Assinado (Renovado no PD025187)	359.00005667/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
300	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD020138	T04	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SISTEMA DE GEST??O DE ATENDIMENTO				E0200162	22.05.2025 - Beatriz manifestou que n??o ir?? prorrogar o contrato, declinou.	359.00002775/2023-55									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
301	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022081	T03	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	Manuten????o e Opera????o do Sistema de Processamento da Folha de Pagamento dos Servidores do Estado\nAPOSTILAMENTO FAZENDA				E0220109	Assinado	359.00009098/2024-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
304	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD211010	T01	Encerrado		2023-08-03 03:00:00	2025-08-02 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	GED				E0211010	Assinado (Renovado no PD025246)	359.00005501/2023-18									2025-12-09 17:19:01.908	2026-01-13 19:57:14.624
305	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE RPUSP	HCRPUSP	PD022167	T02	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVICO				E0220213	Assinado (Renovado no PD251014)	359.00005288/2023-44									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
306	MARIA REGINA FUNICELLO	IMPRENSA OFICIAL DE SERGIPE - IOSE	IOSE	PD023138	TI-2025	Ativo		2025-03-17 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADOS AR				E0230163	Assinado (Renovado no PD025188)	359.00003568/2024-07									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
308	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD023195	T01	Ativo		2024-07-07 03:00:00	2025-07-06 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O - OFFICE  BASICO				E0230224	Assinado	359.00002357/2023-68\n359.00005933/2025-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
309	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD021217	T01	Ativo		2024-07-08 03:00:00	2025-07-07 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DaaS NOTEBOOK PADR??O E ULTRAFINO				E0210276	Contrato Encerrado	359.00006243/2024-78									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
310	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD022432	T0	Ativo		2023-01-12 03:00:00	2025-07-11 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESENVOLVIMENTO, MANUTEN????O EVOLUTIVA E SUSTENTA????O DOS SISTEMAS DE TI				E0220869	Assinado (Renovado no PD025196)	359.00002760/2025-59									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
311	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD022448	T03	Ativo		2025-01-17 03:00:00	2025-07-16 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESENVOLVIMENTO DE SISTEMAS				E0220891	Assinado	359.00003351/2023-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
312	NADIA BERTUCCELLI	MUNICIPIO DE ITUPEVA	SERVI??OS PREFEITURAS	PD022534	T02	Ativo		2024-07-19 03:00:00	2025-07-18 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0220534	Assinado  	359.00002792/2025-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
313	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD024109	T0	Ativo		2024-07-22 03:00:00	2025-07-21 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESENVOLVIMENTOE MANUTEN????O DO SISTEMA DE PROCESSO ELETRONICO "e-TCESP"				E0240160	Assinado (Renovado no PD025168)	359.00001014/2024-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
314	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO JOAQUIM DA BARRA	SERVI??OS PREFEITURAS	PD024655	T0	Ativo		2024-07-22 03:00:00	2025-07-21 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240655	Assinado  	359.00002449/2025-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
315	AMANDA ESTEVES	MUNICIPIO DE GUAREI	SERVI??OS PREFEITURAS	PD020769	T04	Ativo		2024-07-24 03:00:00	2025-07-23 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200769	Renovado no ???PD251188	359.00005207/2025-78									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
316	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD024174	T03	Ativo		2025-05-01 03:00:00	2025-07-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SERVI??OS DE SUPORTE T??CNICO LOCAL, SERVI??OS DE CENTRAL DE ATENDIMENTO (HELP DESK/SERVICE DESK) E  SERVI??OS DE PROCESSAMENTO DE DADOS EM MAINFRAME UNISYS NO DATA CENTER PRODESP				EC240284	Assinado	359.00003267/2024-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
317	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD024209	T0	Ativo		2024-07-29 03:00:00	2025-07-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MIDDLEWARE, NUVEM P??BLICA, PLATAFORMA PaaS , E-MAIL, COLABORA????O E PRODUTIVIDADE				E0240325	Assinado (Renovado no PD025202)	359.00005811/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
318	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD024160	T0	Ativo		2024-07-31 03:00:00	2025-07-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	INFRAESTRUTURA				E0240263	Assinado (Renovado no PD025237)	359.00006282/2024-75									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
347	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE ESTADUAL PAULISTA JULIO DE MESQUITA FILHO	UNESP	PD023209	T01	Ativo		2024-10-18 03:00:00	2025-10-17 03:00:00	\N	53581.09	0.00	0.00	53581.09	0.00	ASSINA SP MULTIBOX				E0230239	Assinado	359.00007600/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
302	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SERRA NEGRA	PREFEITURA	PD024113	T0	Ativo	\N	2024-06-07 09:00:00	2025-06-06 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO -  EMAIL COMO SERVI??O	\N	\N	\N	E0240166	Assinado	359.00003849/2025-32	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
319	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD022474	T0-T2	Ativo		2023-02-01 03:00:00	2025-07-31 03:00:00	\N	6126620.52	0.00	0.00	6126620.52	0.00	SERVI??OS ESPECIALIZADOS DE TI				E0220920	24/09 - Era para ser renovado no PD025249, mas at?? o presente moimento n??o houve formaliza????o de um novo contrato.	359.00000452/2023-27									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
320	DAIANE DA SILVA SOUZA	MUNICIPIO DE BARIRI	SERVI??OS PREFEITURAS	PD020782	T04	Ativo		2024-08-05 03:00:00	2025-08-04 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200782	Renovado no PD251362 	359.00007528/2025-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
321	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	???PD024057 	T0	Ativo		2024-08-07 03:00:00	2025-08-06 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM P??BLICA E CERTIFICADO STANDARD				E0240083	Assinado	359.00005452/2024-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
322	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD024104	T0	Ativo		2024-07-22 03:00:00	2025-07-21 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	E MAIL COMO SERVI??O - OFFICE BASICO				E0240154	Assinado (Renovado no PD025088)	359.00005943/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
323	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA MUNICIPAL DE URBANISMO E LICENCIAMENTO	SMUL	PD022280	T02	Ativo		2024-07-25 03:00:00	2025-07-24 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PUBLICA				E0220372	Contrato Encerrado	359.00004125/2024-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
325	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024195	T0	Ativo		2024-08-14 03:00:00	2025-08-13 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESENVOLVIMENTO E SUSTENTA????O DO PORTAL				E0240313	Assinado (Renovado no PD025029)	359.00003819/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
326	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD025076	T0	Ativo		2025-09-15 03:00:00	2030-09-14 03:00:00	\N	1271787.15	0.00	0.00	1271787.15	0.00	FIREWALL				E0250090											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
327	ANA LIGIA SAPIENZA COLOMBO	SECRETARIA DA JUSTICA E DA DEFESA DA CIDADANIA	SJC	PD023377	T01	Ativo		2025-01-01 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE PLUS				E0230460	Assinado (Renovado no PD251037)	359.00009745/2023-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
328	DAIANE DA SILVA SOUZA	MUNICIPIO DE SALTO	SERVI??OS PREFEITURAS	PD024626	T0	Ativo		2024-08-16 03:00:00	2025-08-15 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0240626	Contrato Novo - PD251437\nAssinado	359.00003073/2024-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
329	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD024445	T0	Ativo		2025-02-16 03:00:00	2025-08-15 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO				E0241012	Assinado	359.00008639/2024-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
330	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE JANDIRA	SERVI??OS PREFEITURAS	PD021692	T03	Ativo		2024-08-19 03:00:00	2025-08-18 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0210692	Contrato Novo - PD251468 \nAssinado	359.00006599/2024-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
331	NADIA BERTUCCELLI	MUNICIPIO DE CONCHAS	SERVI??OS PREFEITURAS	PD024663	T0	Ativo		2024-08-21 03:00:00	2025-08-20 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - SIM				E0240663	Assinado (Renovado no PD251438)	359.00008446/2025-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
332	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD024280	T0	Ativo		2024-08-23 03:00:00	2025-08-22 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE  BASICO - INTERMEDIARIO				E0240416	Renovado	359.00005851/2024-65						PD0251233			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
333	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE ESTADUAL DE CAMPINAS	UNICAMP	PD023089	T02	Ativo		2024-08-29 03:00:00	2025-08-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	NUVEM PUBLICA				E0230103	Assinado	359.00002839/2025-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
334	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PIRAPOZINHO	SERVI??OS PREFEITURAS	PD023660	T01	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0230660	Assinado (Renovado no PD251497 )	359.00008903/2025-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
335	JUNEIDY SOLANGE BETECA JONY	FUND PROF DR MANOEL PEDRO PIMENTEL	FUNAP	PD024306	T0	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO - E-MAIL COMO SERVI??O				E0240445	Assinado (Renovado no PD251063)	359.00006206/2024-60									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
336	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024336	T0	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO E EMAIL COMO SERVI??O				E0240480	Assinado (Renovado no PD251191)	359.00006753/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
337	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DA BAIXADA SANTISTA - AGEM	AGEM	PD024279	T0	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	E MAIL COMO SERVI??O - OFFICE  BASICO				E0240415	Assinado (Renovado no PD0251301)	359.0000.5546/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
338	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023254	T01	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE PLUS				E0230291	Assinado (Renovado no PD0251163)	359.00005422/2023-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
339	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023255	T01	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O - OFFICE  BASICO				E0230292	Assinado	359.00003852/2025-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
340	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD023303	T01	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O - OFFICE BASICO				E0230372	Assinado (Renovado no PD251167)	359.00004931/2023-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
341	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD023166	T01	Ativo		2024-09-05 03:00:00	2025-09-04 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0230194	Assinado (Renovado no PD251153)	359.00005807/2023-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
342	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IGUAPE	SERVI??OS PREFEITURAS	PD024657	T00	Ativo		2024-09-06 03:00:00	2025-09-05 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240657	Foi solicitado a Ficha Cadastral para Prorroga????o mais n??o obtivemos retorno do cliente, contrato encontra se Bloqueado.	359.00006253/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
343	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024182	T0	Ativo		2024-09-06 03:00:00	2025-09-05 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROGRAMA SP SEM PAPEL				E0240299	Assinado (Renovado no PD025212)	359.00007506/2024-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
344	FRANCINE TANIGUCHI FALLEIROS DIAS	SUPERINTENDENCIA DA POLICIA TECNICO-CIENTIFICA	SPTC	PD022159	T0	Ativo		2022-09-08 03:00:00	2025-09-07 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADO DIGITAL				E0220204	Contrato Encerrado	359.00003486/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
345	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD023441	T01	Ativo		2024-09-29 03:00:00	2025-09-28 03:00:00	\N	5453753.46	0.00	0.00	5453753.46	0.00	OUTSOURCING COM GERENCIAMENTO DE PROJETOS,  ANTIV??RUS E INFRAESTRUTURA F??SICA				E0230546\nET230546	Assinado	359.00006535/2023-20									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
346	DAIANE DA SILVA SOUZA	MUNICIPIO DE CACAPAVA	SERVI??OS PREFEITURAS	PD021732	T03	Ativo		2024-10-10 03:00:00	2025-10-09 03:00:00	\N	213840.00	0.00	0.00	213840.00	0.00	PREFEITURA - CADASTRO				E0210732	Assinado	359.00007457/2024-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
348	DAIANE DA SILVA SOUZA	MUNICIPIO DE PEREIRA BARRETO	SERVI??OS PREFEITURAS	PD022573	T02	Ativo		2024-10-27 03:00:00	2025-10-26 03:00:00	\N	55392.00	0.00	0.00	55392.00	0.00	PREFEITURA - CADASTRO				E0220573	Assinado	359.00009507/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
349	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	SEC. CULTURA	PD024185	T0	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	E-MAIL  COMO SERVI??O - OFFICE BASICO				E0240302	Assinado	359.00005663/2023-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
352	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD024259	T0	Ativo		2024-09-04 03:00:00	2025-09-03 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE B??SICO				E0240391	Assinado (Renovado no PD251272)	359.00005887/2024-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
353	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD023174	T01	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O - OFFICE INTERMEDIARIO				E0230202	Assinado (Renovado no PD251154)	359.00005956/2023-33									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
354	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD023466	T0	Ativo		2024-10-28 03:00:00	2025-10-27 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MIDDLEWARE- - E MAIL COMO SERVI??O				E0230584	Reincidido e substituido pelo PD0251138										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
355	NADIA BERTUCCELLI	MUNICIPIO DE BRODOWSK	SERVI??OS PREFEITURAS	PD022560	T02	Ativo		2024-10-30 03:00:00	2025-10-29 03:00:00	\N	41544.00	0.00	0.00	41544.00	0.00	PREFEITURA - CADASTRO				E0220560	Assinado	359.00009542/2024-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
356	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE NAZARE PAULISTA	SERVI??OS PREFEITURAS	PD022576	T02	Ativo		2024-10-31 03:00:00	2025-10-30 03:00:00	\N	13932.00	0.00	0.00	13932.00	0.00	PREFEITURA - SIM				E0220576	Assinado	359.00009740/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
357	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD023108	T0	Ativo		2023-04-30 03:00:00	2025-10-30 03:00:00	\N	20988.00	0.00	0.00	20988.00	0.00	PROGRAMA SP SEM PAPEL				E0230127	Assinado	359.00000086/2023-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
358	DAIANE DA SILVA SOUZA	MUNICIPIO DE LOUVEIRA	SERVI??OS PREFEITURAS	PD023684	T01	Ativo		2024-10-31 03:00:00	2025-10-30 03:00:00	\N	30465.60	0.00	0.00	30465.60	0.00	PREFEITURA - CADASTRO				E0230684	Assinado	359.00008821/2023-20									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
359	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD024169	T0	Ativo		2024-10-31 03:00:00	2025-10-30 03:00:00	\N	67847.71	0.00	0.00	67847.71	0.00	PROGRAMA SP SEM PAPEL				E0240277	Assinado	359.00009721/2024-00									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
360	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023271	T0	Ativo		2023-11-01 03:00:00	2025-10-31 03:00:00	\N	7792788.62	0.00	0.00	7792788.62	0.00	PROCESSAMENTO IBM, ARMAZENAMENTO E RETEN????O DE DADOS				E0230310	Assinado	359.00007113/2023-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
361	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD023365	T01	Ativo		2024-11-01 03:00:00	2025-10-31 03:00:00	\N	93007.20	0.00	0.00	93007.20	0.00	SAM ESTOQUE				E0230446\nE0230447	Assinado	359.00004966/2023-51??									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
362	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023359	T01	Ativo		2024-11-03 03:00:00	2025-11-02 03:00:00	\N	221906.76	0.00	0.00	221906.76	0.00	CHATBOT				E0230437	Assinado	359.00004328/2023-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
363	MARIA REGINA FUNICELLO	BANCO CITIBANK S.A.	CITIBANK	PD020168	T02	Ativo		2023-11-04 03:00:00	2025-11-03 03:00:00	\N	7793.28	0.00	0.00	7793.28	0.00	HOSPEDAGEM DE ROTEADORES				E0200209	prorrog emergencial 3meses\n03/11/25 CONTRATO ASSINADO NO PAPEL.	359.00008087/2023-07									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
364	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IBATE	SERVI??OS PREFEITURAS	PD024690	T0	Ativo		2024-11-05 03:00:00	2025-11-04 03:00:00	\N	40752.00	0.00	0.00	40752.00	0.00	PREFEITURA - CADASTRO				E0240690	Assinado	359.00007903/2024-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
365	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023376	T01	Ativo		2024-11-06 03:00:00	2025-11-05 03:00:00	\N	2621056.30	0.00	0.00	2621056.30	0.00	MANUTEN????O SISTEMA PEP				E0230458\nE0230459	Assinado	359.00007830/2023-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
366	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD023189	T01	Ativo		2024-11-08 03:00:00	2025-11-07 03:00:00	\N	4491729.87	0.00	0.00	4491729.87	0.00	NUVEM PUBLICA				E0230218	Assinado	359.00008302/2023-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
367	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD023256	T01	Ativo		2024-11-08 03:00:00	2025-11-07 03:00:00	\N	74779.42	0.00	0.00	74779.42	0.00	ASSINA.SP CONTAINER				E0230293	Assinado	359.00007706/2023-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
368	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE FRANCISCO MORATO	SERVI??OS PREFEITURAS	PD022566	T02	Ativo		2024-11-10 03:00:00	2025-11-09 03:00:00	\N	376650.00	0.00	0.00	376650.00	0.00	PREFEITURA - CADASTRO				E0220566	Assinado	359.00010511/2024-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
369	JUNEIDY SOLANGE BETECA JONY	SERVICO MUNICIPAL DE AGUA E ESGOTO	SEMAE	PD022290	T0	Ativo		2022-11-08 03:00:00	2025-11-09 03:00:00	\N	767646.84	0.00	0.00	767646.84	0.00	DaaS- DESKTOP e NOTEBOOK COMO SERVI??O				E0220382	Assinado	359.00003686/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
370	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITU	SERVI??OS PREFEITURAS	PD021651	T03	Ativo		2024-11-13 03:00:00	2025-11-12 03:00:00	\N	551296.58	0.00	0.00	551296.58	0.00	PREFEITURA - SIM				E0210651	Assinado	359.00005619/2023-46									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
371	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD023326	T01	Ativo		2024-11-16 03:00:00	2025-11-15 03:00:00	\N	667193.70	0.00	0.00	667193.70	0.00	MONITORAMENTO				E0230397	Assinado	359.00007958/2023-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
372	ANA LIGIA SAPIENZA COLOMBO	FUNDO ESPECIAL DE DESPESA DO MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	FUND. MP	PD023237	T01	Ativo		2024-11-16 03:00:00	2025-11-15 03:00:00	\N	5129558.70	0.00	0.00	5129558.70	0.00	DIGITALIZA????O - CLASSIFICA????O DE DOCUMENTOS E CETIFICADO DIGITAL				E0230269	Assinado	359.00007932/2023-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
373	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD022326	T03	Ativo		2024-11-16 03:00:00	2025-11-15 03:00:00	\N	30653.76	0.00	0.00	30653.76	0.00	SAM PATRIMONIO				E0220425	Assinado	359.00007876/2023-12?? 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
374	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD021316	T03	Ativo		2024-11-17 03:00:00	2025-11-16 03:00:00	\N	10537239.46	0.00	0.00	10537239.46	0.00	SOLU????O TECNOL??GICA DE GERENCIAMENTO DE PROCESSOS COM INTELIG??NCIA ARTIFICIAL				E0210362\nE0210396	Assinado	359.00008468/2023-88									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
375	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SUMARE	SERVI??OS PREFEITURAS	PD022562	T02	Ativo		2024-11-18 03:00:00	2025-11-17 03:00:00	\N	1454520.00	0.00	0.00	1454520.00	0.00	PREFEITURA - CADASTRO				E0220562	Assinado	359.00009217/2024-00									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
376	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD022250	T02	Ativo		2024-10-31 03:00:00	2025-10-30 03:00:00	\N	6313.44	0.00	0.00	6313.44	0.00	SAM PATRIMONIO				E0220329	Assinado										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
351	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SERRANA	PREFEITURA	PD024176	T0	Ativo	\N	2024-08-26 09:00:00	2025-08-25 09:00:00	\N	2554.31	0.00	0.00	2554.31	0.00	CERTIFICADO SSL WILDCARD OV	\N	\N	\N	E0240286	Assinado	359.00006415/2024-11	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
377	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD022258	T02	Ativo		2024-10-31 03:00:00	2025-10-30 03:00:00	\N	6313.44	0.00	0.00	6313.44	0.00	SAM ESTOQUE				E0220341	Assinado	359.00005035/2024-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
378	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD023399	T01	Ativo		2024-10-30 03:00:00	2025-10-29 03:00:00	\N	882.00	0.00	0.00	882.00	0.00	PROGRAMA SP SEM PAPEL				E0230488	Assinado	359.00009209/2023-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
380	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD021220	T01	Ativo		2024-10-29 03:00:00	2025-10-28 03:00:00	\N	131662.52	0.00	0.00	131662.52	0.00	DaaS - NOTEBOOK PADR??O				E0210284	Assinado	359.00005320/2024-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
381	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD024208	T0	Ativo		2024-11-21 03:00:00	2025-11-20 03:00:00	\N	1919648.28	0.00	0.00	1919648.28	0.00	DESENVOLVIMENTO E MANUTEN????O DO SISTEMA SOE-DAEE -				E0240324\nEC240323	Assinado	359.00008941/2024-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
382	NADIA BERTUCCELLI	MUNICIPIO DE CORDEIROPOLIS	SERVI??OS PREFEITURAS	PD024716	T0	Ativo		2024-11-21 03:00:00	2025-11-20 03:00:00	\N	64087.20	0.00	0.00	64087.20	0.00	PREFEITURA - SIM				E0240716	Assinado	359.00010261/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
383	JUNEIDY SOLANGE BETECA JONY	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	ITESP	PD024247	T0	Ativo		2024-11-21 03:00:00	2025-11-20 03:00:00	\N	26576.88	0.00	0.00	26576.88	0.00	SAM PATRIMONIO - SAM ESTOQUE				E0240377\nE0240549	Assinado	359.00007670/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
384	DAIANE DA SILVA SOUZA	MUNICIPIO DE BARUERI	SERVI??OS PREFEITURAS	PD023692	T01	Ativo		2024-11-22 03:00:00	2025-11-21 03:00:00	\N	1569960.00	0.00	0.00	1569960.00	0.00	PREFEITURA - CADASTRO				E0230692	Assinado	359.00008748/2023-96									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
385	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024214	T0	Ativo		2024-08-22 03:00:00	2025-11-21 03:00:00	\N	28587.00	0.00	0.00	28587.00	0.00	SAM ESTOQUE				E0240288\nE0240289	31/10/25 - Contrato assinado	359.00005621/2024-04									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
386	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DA BAIXADA SANTISTA - AGEM	AGEM	PD251301	T0	Ativo		2025-09-19 03:00:00	2028-09-18 03:00:00	\N	38832.12	2157.34	0.00	36674.78	0.00	PLATAFORMA COLABORATIVA I				E0251406											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
387	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD023473	T0	Ativo		2024-04-12 03:00:00	2029-04-11 03:00:00	\N	33872.35	1829.86	0.00	32042.49	0.00	CERTIFICADO SSL STANDARD  RAIZ INTERNACIONAL				E0230596		359.00000472/2024-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
388	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE GUAIRA	SERVI??OS PREFEITURAS	PD024610	T0	Ativo		2024-05-28 03:00:00	2029-05-27 03:00:00	\N	135600.37	26879.68	0.00	108720.69	0.00	PREFEITURA - CADASTRO				E0240610											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
389	NADIA BERTUCCELLI	MUNICIPIO DE ITABERA	SERVI??OS PREFEITURAS	PD024631	T0	Ativo		2024-07-04 03:00:00	2029-07-03 03:00:00	\N	93438.00	12458.40	0.00	80979.60	0.00	PREFEITURA - CADASTRO				E0240631											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
390	DAIANE DA SILVA SOUZA	SAO PAULO SECRETARIA MUNICIPAL DE MOBILIDADE E TRANSPORTES	SERVI??OS PREFEITURAS	PD024648	T0	Ativo		2024-08-01 03:00:00	2029-07-31 03:00:00	\N	135171403.98	24323164.64	0.00	110848239.34	0.00	PREFEITURA - CADASTRO				E0240648											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
391	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO MANUEL	SERVI??OS PREFEITURAS	PD024679	T0	Ativo		2024-09-13 03:00:00	2029-09-12 03:00:00	\N	279162.01	26075.33	0.00	253086.68	0.00	PREFEITURA - CADASTRO				E0240679											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
392	NADIA BERTUCCELLI	MUNICIPIO DE CAJAMAR	SERVI??OS PREFEITURAS	PD024662	T01	Ativo		2025-10-31 03:00:00	2029-10-30 03:00:00	\N	2970008.49	47056.66	0.00	2922951.83	0.00	PREFEITURA CADASTRO				E0240662											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
393	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD024438	T0	Ativo		2024-12-19 03:00:00	2029-12-18 03:00:00	\N	34703639.70	4260316.32	0.00	30443323.38	0.00	MANUTEN????O DE SISTEMAS				E0241004		359.00009106/2024-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
394	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD024371	T0	Ativo		2025-01-01 03:00:00	2029-12-31 03:00:00	\N	1607167.20	93900.95	0.00	1513266.25	0.00	INFRAESTRUTURA COMPUTACIONAL				E0240518		359.00007848/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
395	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO CONSERV PROD FLORESTAL EST SP	FUND. FLORESTAL	PD024362	T0	Ativo		2024-11-23 03:00:00	2025-11-22 03:00:00	\N	523031.04	0.00	0.00	523031.04	0.00	OUTSOURCING DE TI				E0240509	Assinado	359.00009966/2024-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
396	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE VINHEDO	SERVI??OS PREFEITURAS	PD022569	T02	Ativo		2024-11-27 03:00:00	2025-11-26 03:00:00	\N	1041771.60	0.00	0.00	1041771.60	0.00	PREFEITURA - CADASTRO				E0220569	Assinado	359.00008808/2024-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
397	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023029	T01	Ativo		2024-11-27 03:00:00	2025-11-26 03:00:00	\N	3859704.36	0.00	0.00	3859704.36	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES - PAAS BANCO DE DADOS MICROSOFT  SQL				E0230036\nE0230513	Assinado	359.00008212/2023-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
398	DAIANE DA SILVA SOUZA	MUNICIPIO DE URUPES	SERVI??OS PREFEITURAS	PD024711	T0	Ativo		2024-11-27 03:00:00	2025-11-26 03:00:00	\N	85449.60	0.00	0.00	85449.60	0.00	PREFEITURA - SIM				E0240711	Assinado	359.00010008/2024-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
399	DAIANE DA SILVA SOUZA	MUNICIPIO  DE JACUPIRANGA	SERVI??OS PREFEITURAS	PD022588	T02	Ativo		2024-11-29 03:00:00	2025-11-28 03:00:00	\N	16632.00	0.00	0.00	16632.00	0.00	PREFEITURA - CADASTRO				E0220588	Assinado	359.00010333/2024-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
400	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023311	T01	Ativo		2024-11-29 03:00:00	2025-11-28 03:00:00	\N	1773002.88	0.00	0.00	1773002.88	0.00	MODERNIZA????O DO PORTAL				E0230381	Assinado	359.00009076/2023-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
401	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD024357	T0	Ativo		2024-11-29 03:00:00	2025-11-28 03:00:00	\N	8198.69	0.00	0.00	8198.69	0.00	PROGRAMA SP SEM PAPEL				E0240503	Assinado	359.0000.7042/2024-98									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
402	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IGARAPAVA	SERVI??OS PREFEITURAS	PD023664	T01	Ativo		2024-11-30 03:00:00	2025-11-29 03:00:00	\N	10395.00	0.00	0.00	10395.00	0.00	PREFEITURA - CADASTRO				E0230664	Assinado	359.00000349/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
403	AMANDA ESTEVES	MUNICIPIO DE JACAREI	SERVI??OS PREFEITURAS	PD023688	T01	Ativo		2024-11-30 03:00:00	2025-11-29 03:00:00	\N	1916280.00	0.00	0.00	1916280.00	0.00	PREFEITURA - CADASTRO				E0230688	Assinado	359.00008822/2023-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
404	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023316	T01	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	307963.68	0.00	0.00	307963.68	0.00	SAM PATRIMONIO				E0230386\nE0230387	Assinado	359.00009063/2023-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
405	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	PD023384	T01	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	3195.36	0.00	0.00	3195.36	0.00	PROGRAMA  SP SEM PAPEL				E0230467	Assinado	359.00009202/2024-33									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
406	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PARA O REMEDIO POPULAR FURP	FURP	PD024019	T01	Ativo		2025-03-08 03:00:00	2029-03-07 03:00:00	\N	6661.44	1028.40	0.00	5633.04	0.00	PROGRAMA SP SEM PAPEL				E0240024											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
407	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	SEC. CULTURA	PD023398	T01	Ativo		2024-11-25 03:00:00	2025-11-24 03:00:00	\N	12600.00	0.00	0.00	12600.00	0.00	PROGRAMA SP SEM PAPEL				E0230487	Assinado	359.00009000/2023-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
408	ANA LIGIA SAPIENZA COLOMBO	SECRETARIA DA JUSTICA E DA DEFESA DA CIDADANIA	SJC	PD023433	T01	Ativo		2024-11-29 03:00:00	2025-11-28 03:00:00	\N	16295.28	0.00	0.00	16295.28	0.00	PROGRAMA SP SEM PAPEL				E0230536	Assinado	359.00008686/2023-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
409	DAIANE DA SILVA SOUZA	MUNICIPIO DE NATIVIDADE DA SERRA	SERVI??OS PREFEITURAS	PD025016	T0	Ativo		2024-12-02 03:00:00	2025-12-01 03:00:00	\N	51552.00	0.00	0.00	51552.00	0.00	PREFEITURA - CADASTRO				E0250020	Assinado	359.00010368/2024-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
410	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD024445	T01	Ativo		2025-08-16 03:00:00	2025-12-10 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO				E0241012	09/12 - \tAguardando de acordo do delivery	359.00008639/2024-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
411	DAIANE DA SILVA SOUZA	MUNICIPIO DE ITUVERAVA	SERVI??OS PREFEITURAS	PD022587	T02	Ativo		2024-12-14 03:00:00	2025-12-13 03:00:00	\N	34320.00	0.00	0.00	34320.00	0.00	PREFEITURA - CADASTRO				E0220587	Assinado	359.00011227/2024-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
412	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD021334	T01	Ativo		2024-12-16 03:00:00	2025-12-15 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	DESKTOP COMO SERVI??O DaaS - DESKTOP B??SICO, DESKTOP AVAN??ADO, DESKTOP PLUS, NOTEBOOK PADR??O, NOTEBOOK ULTRAFINO				E0210438	N??o ter?? continuidade. O servi??o foi Renovado atrav??s do contrato PD025892. Estamos em tratativas de Encerramento.	359.00008879/2024-54						PD025892			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
413	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD024349	T0	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	103347.60	0.00	0.00	103347.60	0.00	SAM MODULO ESTOQUE - PATRIMONIO				E0240495	Assinado	359.00006895/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
414	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD021143	T03	Ativo		2024-12-23 03:00:00	2025-12-22 03:00:00	\N	220986.36	0.00	0.00	220986.36	0.00	HOSPEDAGEM VIRTUALIZADA				E0210176	Assinado	359.00007156/2023-57									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
415	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE DESENVOLVIMENTO SOCIAL	SEDS	PD024478	T0	Ativo		2024-12-26 03:00:00	2025-12-25 03:00:00	\N	7078088.21	0.00	0.00	7078088.21	0.00	DESENVOLVIMENTO DE SISTEMAS, HOSPEDAGEM, CONECTIVIDADE, FERRAMENTA DE MONITORAMENTO, PLATAFORMA PaaS, CERTIFICADO DIGITAL E OUTSOURCING				E0241054	25-11-2025 - Conforme e-mail enviado pelo cliente, o contrato n??o ser?? PRORROGADO / RENOVADO.	359.00009405/2024-20									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
416	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD023005	T02	Ativo		2024-12-28 03:00:00	2025-12-27 03:00:00	\N	1196692.80	0.00	0.00	1196692.80	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES				E0230006	Assinado	359.00005012/2023-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
417	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD024483	T0	Ativo		2024-12-28 03:00:00	2025-12-27 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CERTIFICADO DIGITAL				E0241060	09/12 - Solicitado minuta - aguardando envio	359.00009468/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
418	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD023192	T01	Ativo		2025-06-30 03:00:00	2025-12-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE  BASICO				E0230221	09/12 - \tRetorno CJ, necess??rio enviar cliente	359.00000350/2023-10 						PD025207			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
419	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD022426	T02	Ativo		2025-01-03 03:00:00	2026-01-02 03:00:00	\N	1132.71	0.00	0.00	1132.71	0.00	PROGRAMA SP SEM PAPEL				E0220862	Assinado	359.00008571/2023-28 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
420	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD023164	T01	Ativo		2024-10-25 03:00:00	2026-01-24 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MANUTEN????O DO SISTEMA				E0230192	CONTRATO SEFAZ SUB-ROGADO PARA SGGD\n06/11/25 - Proposta encaminhada ao cliente	359.00002904/2023-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
449	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD024232	T0	Ativo		2025-10-03 03:00:00	2026-10-02 03:00:00	\N	19173023.38	0.00	0.00	19173023.38	0.00	NUVEM				E0240351		359.00009044/2025-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
421	DAIANE DA SILVA SOUZA	MUNICIPIO DE VALINHOS	SERVI??OS PREFEITURAS	PD024702	T01	Ativo		2025-12-04 03:00:00	2026-12-03 03:00:00	\N	1772760.00	620456.67	0.00	1152303.33	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0240702		359.00008668/2024-11									2025-12-09 17:19:01.908	2025-12-30 13:14:54.582
422	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE LORENA	SERVI??OS PREFEITURAS	PD024712	T1	Ativo		2025-12-03 03:00:00	2026-12-02 03:00:00	\N	256348.80	44508.42	0.00	211840.38	0.00	PREFEITURA - SIM	SEM TRATATIVA			E0240712		359.00010011/2024-14									2025-12-09 17:19:01.908	2025-12-30 13:11:15.973
423	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESOS E MEDIDAS DO ESTADO DE SAO PAULO	IPEM	PD022436	T2-T3	Ativo		2025-12-07 03:00:00	2027-12-06 03:00:00	\N	83149.81	53233.31	0.00	29916.50	0.00	SAM PATRIMONIO	SEM TRATATIVA			E0220876		359.00008394/2023-80									2025-12-09 17:19:01.908	2025-12-30 13:16:37.032
424	NADIA BERTUCCELLI	RP MOBI EMPRESA DE MOBILIDADE URBANA DE RIBEIRAO PRETO	SERVI??OS PREFEITURAS	PD024715	T01	Ativo		2025-12-10 03:00:00	2027-12-09 03:00:00	\N	6636600.00	1666608.00	0.00	4969992.00	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0240715		35900010718/2024-21									2025-12-09 17:19:01.908	2025-12-30 13:17:55.371
425	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD024241	T01	Ativo		2025-12-11 03:00:00	2026-12-10 03:00:00	\N	83882.80	61701.80	0.00	22181.00	0.00	SAM ESTOQUE	SEM TRATATIVA			E0240368\nE0240369	Assinado	359.00007552/2024-65									2025-12-09 17:19:01.908	2025-12-30 13:19:14.942
426	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD022261	T0-T1	Ativo		2026-01-01 03:00:00	2028-06-30 03:00:00	\N	525040644.21	190800448.27	0.00	334240195.94	0.00	DESENVOLVIMENTO, MANUTEN????O  EVOLUTIVA E SUSTENTA????O DE SISTEMAS - PAAS MIDDLEWARE COM SERVI??OS DE GEST??O	SEM TRATATIVA			E0220349		359.00002323/2023-73									2025-12-09 17:19:01.908	2025-12-30 13:21:23.526
427	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PDC22034	T04	Ativo		2026-02-21 03:00:00	2026-11-20 03:00:00	\N	28340269.16	7112119.11	0.00	21228150.05	0.00	F??BRICA DE SOFTWARE	SEM TRATATIVA			EC220045	PRORROG ANTECIPADA COM ADITAMENTO. enviar email kickoff_cadERP + baixa PNPP e SEI	359.00001180/2023-82									2025-12-09 17:19:01.908	2025-12-30 13:25:07.789
428	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE LARANJAL PAULISTA	SERVI??OS PREFEITURAS	PD024696	T01	Ativo		2025-12-13 03:00:00	2029-12-12 03:00:00	\N	161100.00	29857.20	0.00	131242.80	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0240696		359.00011354/2024-04									2025-12-09 17:19:01.908	2025-12-30 13:38:14.95
429	NADIA BERTUCCELLI	MUNICIPIO DE TAUBATE	SERVI??OS PREFEITURAS	PD023698	T02	Ativo		2025-12-13 03:00:00	2027-12-12 03:00:00	\N	4766400.00	2194648.82	0.00	2571751.18	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0230698		359.00009630/2023-85									2025-12-09 17:19:01.908	2025-12-30 13:36:13.418
430	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTO ANTONIO DO PINHAL	SERVI??OS PREFEITURAS	PD023681	T02	Ativo		2025-12-14 03:00:00	2026-12-13 03:00:00	\N	427416.00	82727.04	0.00	344688.96	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0230681		359.00009384/2023-61									2025-12-09 17:19:01.908	2025-12-30 13:39:25.332
431	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE GARCA	SERVI??OS PREFEITURAS	PD024727	T01	Ativo		2025-12-30 03:00:00	2026-12-29 03:00:00	\N	64440.00	25324.92	0.00	39115.08	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0240727		359.00011552/2024-60									2025-12-09 17:19:01.908	2025-12-30 13:40:41.804
432	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD022024	T02	Ativo		2024-10-21 03:00:00	2026-01-20 03:00:00	\N	3344.64	0.00	0.00	3344.64	0.00	ASSINA.SP FACIL				E0220032	PROPOSTA ENVIADA 13/11 - COBREI A MINUTA 02/12 - necess??rio ajustes 03/12	359.00007760/2023-83									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
433	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD022476	T0	Ativo		2023-03-23 03:00:00	2026-03-22 03:00:00	\N	778869.60	0.00	0.00	778869.60	0.00	DaaS				E0220923		359.00007380/2025-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
434	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD023361	T01	Ativo		2025-04-12 03:00:00	2026-04-11 03:00:00	\N	82200.00	0.00	0.00	82200.00	0.00	SMTP				E0230439		359.00004624/2023-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
435	DAIANE DA SILVA SOUZA	MUNICIPIO DE MARTINOPOLIS	SERVI??OS PREFEITURAS	PD024673	T00	Ativo		2025-05-20 03:00:00	2026-05-19 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240673		359.00002750/2024-32									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
436	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD022482	T02	Ativo		2025-06-16 03:00:00	2026-06-15 03:00:00	\N	141940.92	0.00	0.00	141940.92	0.00	SISTEMA INTEGRADO DE MULTAS - SIM				E0220948		359.00003890/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
437	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD025126 	T04	Ativo		2025-04-01 03:00:00	2026-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	FOLHA DE PAGAMENTO				E0190265		359.00001016/2025-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
438	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD025010		Ativo		2025-07-22 03:00:00	2026-07-21 03:00:00	\N	24334071.76	0.00	0.00	24334071.76	0.00	GERENCIAMENTO DE PROJETOS				E0250012\nE0250013		359.00010181/2024-07 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
439	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD024117		Ativo		2025-08-01 03:00:00	2026-07-31 03:00:00	\N	108359982.63	0.00	0.00	108359982.63	0.00	BALC??O ??NICO - BARRAMENTO E MIGRA????O PARA O INTEGRADOR.SP				E0240170\nE0240171\nE0240172\nE0240173\nE0240178\nE0240179\nE0240180\nE0240185\nE0240186\nE0240187\nE0240188\nE0240189\nE0240190\nE0240191\nE0240193\nE0240194\nE0240195\nE0240196\nE0240198\nE0240199\nE0240202\nE0240203\nE0240204\nE0240205\nE0240365		359.00010094/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
440	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE ESTADUAL DE CAMPINAS	UNICAMP	PD025184	T0	Ativo		2025-08-15 03:00:00	2026-08-14 03:00:00	\N	3999974.86	0.00	0.00	3999974.86	0.00	NUVEM				E0250214		359.00002839/2025-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
441	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD025151	T0	Ativo		2025-08-19 03:00:00	2026-08-18 03:00:00	\N	16471.50	0.00	0.00	16471.50	0.00	CERTIFICADO DIGITAL				E0250173		359.00001922/2025-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
442	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD0251163	T0	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				E0251281		359.00004710/2025-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
443	JUNEIDY SOLANGE BETECA JONY	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	ITESP	???PD251148	T0	Ativo		2025-09-18 03:00:00	2026-09-17 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				???E0251255		359.00004268/2025-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
444	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD024236	T0	Ativo		2025-09-25 03:00:00	2026-09-24 03:00:00	\N	26668414.06	0.00	0.00	26668414.06	0.00	HELP DESK				E0240357		359.00009060/2025-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
445	LUCIANO PACHECO	CODERP CIA DE DESENVOLVIMENTO ECONOMICO DE RIB PRETO	CODERP	PD0251306	T0	Ativo		2025-09-26 03:00:00	2026-09-25 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				E0251413		359.00006721/2025-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
446	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD025241	T0	Ativo		2025-09-26 03:00:00	2026-09-25 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	FOLHA DE PAGAMENTO				E0250293\nE0250294		359.00005422/2025-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
447	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD023441	T02	Ativo		2025-09-29 03:00:00	2026-09-28 03:00:00	\N	5453753.46	0.00	0.00	5453753.46	0.00	ANTIV??RUS E INFRAESTRUTURA F??SICA				ET230546											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
448	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD023441	T02	Ativo		2025-09-29 03:00:00	2026-09-28 03:00:00	\N	5453753.46	0.00	0.00	5453753.46	0.00	OUTSOURCING COM GERENCIAMENTO DE PROJETOS,  ANTIV??RUS E INFRAESTRUTURA F??SICA				E0230546											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
450	DAIANE DA SILVA SOUZA	MUNICIPIO DE CACAPAVA	SERVI??OS PREFEITURAS	PD021732	T04-T05	Ativo		2025-10-10 03:00:00	2026-10-09 03:00:00	\N	213840.00	0.00	0.00	213840.00	0.00	PREFEITURA CADASTRO				E0210732											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
451	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE ESTADUAL PAULISTA JULIO DE MESQUITA FILHO	UNESP	PD023209	T02	Ativo		2025-10-17 03:00:00	2026-10-16 03:00:00	\N	53581.09	0.00	0.00	53581.09	0.00	ASSINA SP MULTIBOX				E0230239											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
452	AMANDA ESTEVES	MUNICIPIO DE BIRITIBA-MIRIM	SERVI??OS PREFEITURAS	PD251500	T0	Ativo		2025-10-23 03:00:00	2026-10-22 03:00:00	\N	64440.00	0.00	0.00	64440.00	0.00	PREFEITURA - CADASTRO				E0251613		359.00008911/2025-82									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
453	JUNEIDY SOLANGE BETECA JONY	EMPRESA METROP DE TRANSP URBANOS DE S PAULO S/A 	EMTU	PD024003	T01	Ativo		2025-02-24 03:00:00	2026-02-23 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROGRAMA SP SEM PAPEL				E0240003		359.00008411/2023-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
454	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	???PD025108	T0	Ativo		2025-05-01 03:00:00	2026-04-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				E0250124		359.0000.0734/2025-96									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
455	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ZERBINI	FZ	PD024144	T0	Ativo		2024-05-20 03:00:00	2026-05-19 03:00:00	\N	3684.71	0.00	0.00	3684.71	0.00	CERTIFICADO DIGITAL				E0240244		359.00003487/2024-07									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
459	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	???PD251154	T0	Ativo		2025-09-01 03:00:00	2026-08-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				E0251266		359.00004696/2025-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
460	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD025109	T0	Ativo		2025-10-23 03:00:00	2026-10-22 03:00:00	\N	13078797.82	0.00	0.00	13078797.82	0.00	SUSTENTA????O				E0250125		 359.00000933/2025-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
461	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD025892	T0	Ativo		2025-10-29 03:00:00	2026-10-28 03:00:00	\N	3553458.72	0.00	0.00	3553458.72	0.00	DESKTOP E NOTEBOOK COMO SERVI??O DAAS				E0250892		359.00008686/2025-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
462	NADIA BERTUCCELLI	MUNICIPIO DE BRODOWSK	SERVI??OS PREFEITURAS	PD022560	T03	Ativo		2025-10-30 03:00:00	2026-10-29 03:00:00	\N	41544.00	0.00	0.00	41544.00	0.00	PREFEITURA CADASTRO				E0220560											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
463	DAIANE DA SILVA SOUZA	MUNICIPIO DE LOUVEIRA	SERVI??OS PREFEITURAS	PD023684	T02	Ativo		2025-10-31 03:00:00	2026-10-30 03:00:00	\N	30465.60	0.00	0.00	30465.60	0.00	PREFEITURA CADASTRO				E0230684											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
457	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE JACAREI	PREFEITURA	PD251232??	T0	Ativo	\N	2025-09-04 09:00:00	2026-09-03 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE	\N	\N	\N	E0240417	\N	359.00003282/2025-02	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
464	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE NAZARE PAULISTA	SERVI??OS PREFEITURAS	PD022576	T03	Ativo		2025-10-31 03:00:00	2026-10-30 03:00:00	\N	13932.00	0.00	0.00	13932.00	0.00	PREFEITURA SIM				E0220576											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
465	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD023365	T02	Ativo		2025-11-01 03:00:00	2026-10-31 03:00:00	\N	93007.20	0.00	0.00	93007.20	0.00	SAM ESTOQUE				E0230446											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
466	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD023365	T02	Ativo		2025-11-01 03:00:00	2026-10-31 03:00:00	\N	93007.20	0.00	0.00	93007.20	0.00	SAM PATRIMONIO				E0230447											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
467	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023359	T02	Ativo		2025-11-03 03:00:00	2026-11-02 03:00:00	\N	221906.76	0.00	0.00	221906.76	0.00	CHATBOT				E0230437											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
468	NADIA BERTUCCELLI	MUNICIPIO DE IBATE	SERVI??OS PREFEITURAS	PD024690	T01	Ativo		2025-11-05 03:00:00	2026-11-04 03:00:00	\N	40752.00	0.00	0.00	40752.00	0.00	PREFEITURA CADASTRO				E0240690											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
469	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023376	T02	Ativo		2025-11-06 03:00:00	2026-11-05 03:00:00	\N	2621056.30	0.00	0.00	2621056.30	0.00	MANUTEN????O SISTEMA PEP				E0230458											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
470	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023376	T02	Ativo		2025-11-06 03:00:00	2026-11-05 03:00:00	\N	2621056.30	0.00	0.00	2621056.30	0.00	NUVEM PRODESP, CERTIFICADO SSL - OV  E INSTALA????O SERVIDORES				E0230459											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
471	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD024491	T0	Ativo		2025-11-07 03:00:00	2026-11-06 03:00:00	\N	16704565.60	0.00	0.00	16704565.60	0.00	SISTEMA PROCON				E0241069		359.00009733/2024-26									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
472	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD023256	T02	Ativo		2025-11-08 03:00:00	2026-11-07 03:00:00	\N	74779.42	0.00	0.00	74779.42	0.00	ASSINA SP CONTAINER				E0230293											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
473	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD023189	T02	Ativo		2025-11-08 03:00:00	2026-11-07 03:00:00	\N	4491729.87	0.00	0.00	4491729.87	0.00	NUVEM PUBLICA				E0230218											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
474	JUNEIDY SOLANGE BETECA JONY	SERVICO MUNICIPAL DE AGUA E ESGOTO	SEMAE	PD022290	T01	Ativo		2025-11-10 03:00:00	2026-11-09 03:00:00	\N	767646.84	0.00	0.00	767646.84	0.00	DaaS- DESKTOP e NOTEBOOK COMO SERVI??O				E0220382											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
475	JUNEIDY SOLANGE BETECA JONY	C E C M DOS TRAB.DA CIA PROC.DADOS EST.SP CREDIPRODESP	CREDIPRODESP	PD251597	T0	Ativo		2025-11-10 03:00:00	2026-11-09 03:00:00	\N	25335.12	0.00	0.00	25335.12	0.00	PLATAFORMA COLABORATIVA I				E0251711											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
476	AMANDA ESTEVES	MUNICIPIO DE FRANCISCO MORATO	SERVI??OS PREFEITURAS	PD022566	T03	Ativo		2025-11-10 03:00:00	2026-11-09 03:00:00	\N	376650.00	0.00	0.00	376650.00	0.00	PREFEITURA CADASTRO				E0220566											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
477	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD251233	T0	Ativo		2025-11-12 03:00:00	2026-11-11 03:00:00	\N	382617.60	0.00	0.00	382617.60	0.00	PLATAFORMA COLABORATIVA I				E0251150											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
478	JUNEIDY SOLANGE BETECA JONY	SERVICO MUNICIPAL DE AGUA E ESGOTO	SEMAE	PD251344	T0	Ativo		2025-11-13 03:00:00	2026-11-12 03:00:00	\N	459768.60	0.00	0.00	459768.60	0.00	PLATAFORMA COLABORATIVA I + SMTP				E0251452											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
479	DAIANE DA SILVA SOUZA	MUNICIPIO DE ITU	SERVI??OS PREFEITURAS	PD021651	T04	Ativo		2025-11-13 03:00:00	2026-11-12 03:00:00	\N	551296.58	0.00	0.00	551296.58	0.00	PREFEITURA SIM				E0210651											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
480	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD025254	T0	Ativo		2025-11-14 03:00:00	2026-11-13 03:00:00	\N	12777.33	0.00	0.00	12777.33	0.00	CERTIFICADO DIGITAL				E0250308											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
481	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD022376	T04	Ativo		2025-11-09 03:00:00	2026-11-08 03:00:00	\N	18944.04	0.00	0.00	18944.04	0.00	SAM ESTOQUE E PATRIMONIO				E0220488											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
482	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD022258	T03	Ativo		2025-10-31 03:00:00	2026-10-30 03:00:00	\N	6313.44	0.00	0.00	6313.44	0.00	SAM ESTOQUE				E0220341											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
483	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD023399	T02	Ativo		2025-10-30 03:00:00	2026-10-29 03:00:00	\N	882.00	0.00	0.00	882.00	0.00	PROGRAMA SP SEM PAPEL				E0230488											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
484	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD0251420	T0	Ativo		2025-11-04 03:00:00	2026-11-03 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				E0251529		359.00008308/2025-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
488	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD021220	T02	Ativo		2025-10-29 03:00:00	2026-10-28 03:00:00	\N	131662.52	0.00	0.00	131662.52	0.00	DaaS - NOTEBOOK PADR??O				E0210284											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
489	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD251295	T0	Ativo		2025-11-14 03:00:00	2026-11-13 03:00:00	\N	1224576.00	0.00	0.00	1224576.00	0.00	PLATAFORMA COLABORATIVA I				E0251397											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
490	AMANDA ESTEVES	MUNICIPIO DE NOVA CAMPINA	SERVI??OS PREFEITURAS	PD251650	T0	Ativo		2025-11-14 03:00:00	2026-11-13 03:00:00	\N	7732.80	0.00	0.00	7732.80	0.00	PREFEITURA CADASTRO				E0251759											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
491	ANA LIGIA SAPIENZA COLOMBO	FUNDO ESPECIAL DE DESPESA DO MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	FUND. MP	PD023237	T02	Ativo		2025-11-16 03:00:00	2026-11-15 03:00:00	\N	5129558.70	0.00	0.00	5129558.70	0.00	DIGITALIZA????O - CLASSIFICA????O DE DOCUMENTOS E CETIFICADO DIGITAL				E0230269											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
492	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD023326	T02	Ativo		2025-11-16 03:00:00	2026-11-15 03:00:00	\N	667193.70	0.00	0.00	667193.70	0.00	MONITORAMENTO				E0230397											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
493	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD022326	T04	Ativo		2025-11-16 03:00:00	2026-11-15 03:00:00	\N	30653.76	0.00	0.00	30653.76	0.00	SAM PATRIMONIO				E0220425											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
494	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	SEADE	PD025298	T0	Ativo		2025-11-17 03:00:00	2026-11-16 03:00:00	\N	816289.22	0.00	0.00	816289.22	0.00	PLATAFORMA COLABORATIVA I, MIDDLEWARE				E0250364											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
495	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	SEADE	PD025298	T0	Ativo		2025-11-17 03:00:00	2026-11-16 03:00:00	\N	816289.22	0.00	0.00	816289.22	0.00	PLATAFORMA COLABORATIVA I, MIDDLEWARE				E0250368											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
486	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MONTE AZUL PAULISTA	PREFEITURA	PD251380	T0	Ativo	\N	2025-10-23 09:00:00	2026-10-22 09:00:00	\N	58798.80	0.00	0.00	58798.80	0.00	CIDADES.SP.GOV.BR	\N	\N	\N	E0251493	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
496	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD021316	T04	Ativo		2025-11-17 03:00:00	2026-11-16 03:00:00	\N	10537239.46	0.00	0.00	10537239.46	0.00	SOLU????O TECNOL??GICA DE GERENCIAMENTO DE PROCESSOS COM INTELIG??NCIA ARTIFICIAL				E0210362											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
497	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD021316	T04	Ativo		2025-11-17 03:00:00	2026-11-16 03:00:00	\N	10537239.46	0.00	0.00	10537239.46	0.00	SOLU????O TECNOL??GICA DE GERENCIAMENTO DE PROCESSOS COM INTELIG??NCIA ARTIFICIAL				E0210396											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
498	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD025299	T0	Ativo		2025-11-18 03:00:00	2026-11-17 03:00:00	\N	79782239.14	0.00	0.00	79782239.14	0.00	AUDITORIA FOLHA DE PAGEMENTO				E0250365											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
499	DAIANE DA SILVA SOUZA	MUNICIPIO DE SUMARE	SERVI??OS PREFEITURAS	PD022562	T03	Ativo		2025-11-18 03:00:00	2026-11-17 03:00:00	\N	1454520.00	0.00	0.00	1454520.00	0.00	PREFEITURA CADASTRO				E0220562											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
500	LUCIANO PACHECO	FUNDO SOCIAL DE SAO PAULO - FUSSP	FUSSP	PD251197	T0	Ativo		2025-11-19 03:00:00	2026-11-18 03:00:00	\N	171875.52	0.00	0.00	171875.52	0.00	PLATAFORMA COLABORATIVA I				E0251344											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
501	AMANDA ESTEVES	MUNICIPIO DE FERRAZ DE VASCONCELOS	SERVI??OS PREFEITURAS	PD251351	T0	Ativo		2025-11-19 03:00:00	2026-11-18 03:00:00	\N	1138189.32	0.00	0.00	1138189.32	0.00	PREFEITURA CADASTRO				E0251459											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
502	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD024208	T01	Ativo		2025-11-21 03:00:00	2026-11-20 03:00:00	\N	1919648.28	0.00	0.00	1919648.28	0.00	DESENVOLVIMENTO E MANUTEN????O DO SISTEMA SOE-DAEE -				E0240324											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
503	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD024208	T01	Ativo		2025-11-21 03:00:00	2026-11-20 03:00:00	\N	1919648.28	0.00	0.00	1919648.28	0.00	DESENVOLVIMENTO E MANUTEN????O DO SISTEMA SOE-DAEE -				EC240323											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
504	NADIA BERTUCCELLI	MUNICIPIO DE CORDEIROPOLIS	SERVI??OS PREFEITURAS	PD024716	T01	Ativo		2025-11-21 03:00:00	2026-11-20 03:00:00	\N	64087.20	0.00	0.00	64087.20	0.00	PREFEITURA SIM				E0240716											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
505	DAIANE DA SILVA SOUZA	MUNICIPIO DE BARUERI	SERVI??OS PREFEITURAS	PD023692	T03	Ativo		2025-11-22 03:00:00	2026-11-21 03:00:00	\N	1569960.00	0.00	0.00	1569960.00	0.00	PREFEITURA CADASTRO				E0230692											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
506	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO CONSERV PROD FLORESTAL EST SP	FUND. FLORESTAL	PD024362	T01	Ativo		2025-11-23 03:00:00	2026-11-22 03:00:00	\N	523031.04	0.00	0.00	523031.04	0.00	OUTSOURCING DE TI				E0240509											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
507	AMANDA ESTEVES	MUNICIPIO DE AGUAS DA PRATA	SERVI??OS PREFEITURAS	PD251418	T0	Ativo		2025-11-25 03:00:00	2026-11-24 03:00:00	\N	51552.00	0.00	0.00	51552.00	0.00	PREFEITURA CADASTRO				E0251527											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
508	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE VINHEDO	SERVI??OS PREFEITURAS	PD022569	T03	Ativo		2025-11-27 03:00:00	2026-11-26 03:00:00	\N	1041771.60	0.00	0.00	1041771.60	0.00	PREFEITURA CADASTRO				E0220569											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
509	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD024357	T01	Ativo		2025-11-29 03:00:00	2026-11-28 03:00:00	\N	8198.69	0.00	0.00	8198.69	0.00	PROGRAMA SP SEM PAPEL				E0240503											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
510	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023311	T02	Ativo		2025-11-29 03:00:00	2026-11-28 03:00:00	\N	1773002.88	0.00	0.00	1773002.88	0.00	MODERNIZA????O DO PORTAL				E0230381											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
511	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IGARAPAVA	SERVI??OS PREFEITURAS	PD023664	T02	Ativo		2025-11-30 03:00:00	2026-11-29 03:00:00	\N	10395.00	0.00	0.00	10395.00	0.00	PREFEITURA CADASTRO				E0230664											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
512	AMANDA ESTEVES	MUNICIPIO DE JACAREI	SERVI??OS PREFEITURAS	PD023688	T02	Ativo		2025-11-30 03:00:00	2026-11-29 03:00:00	\N	1916280.00	0.00	0.00	1916280.00	0.00	PREFEITURA CADASTRO				E0230688											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
513	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD022476	T01	Ativo		2025-12-01 03:00:00	2026-11-30 03:00:00	\N	778869.60	0.00	0.00	778869.60	0.00	DAAS DESKTOP BASICO-NOTEBOOK BASICO				E0220923											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
514	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023316	T02	Ativo		2025-12-01 03:00:00	2026-11-30 03:00:00	\N	307963.68	0.00	0.00	307963.68	0.00	SUPORTE T??CNICO				E0230387											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
515	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023316	T02	Ativo		2025-12-01 03:00:00	2026-11-30 03:00:00	\N	307963.68	0.00	0.00	307963.68	0.00	SAM PATRIMONIO				E0230386											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
516	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD251313	T0	Ativo		2025-12-01 03:00:00	2026-11-30 03:00:00	\N	36750.00	0.00	0.00	36750.00	0.00	VPN				E0251417											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
517	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTO ANTONIO DO PINHAL	SERVI??OS PREFEITURAS	PD023681	T02	Ativo		2025-12-14 03:00:00	2026-12-13 03:00:00	\N	162456.00	0.00	0.00	162456.00	0.00	PREFEITURA CADASTRO				E0230681											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
518	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	SEC. CULTURA	PD023398	T02	Ativo		2025-11-25 03:00:00	2026-11-24 03:00:00	\N	12600.00	0.00	0.00	12600.00	0.00	PROGRAMA SP SEM PAPEL				E0230487											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
519	ANA LIGIA SAPIENZA COLOMBO	SECRETARIA DA JUSTICA E DA DEFESA DA CIDADANIA	SJC	PD023433	T02	Ativo		2025-11-29 03:00:00	2026-11-28 03:00:00	\N	16295.28	0.00	0.00	16295.28	0.00	PROGRAMA SP SEM PAPEL				E0230536											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
520	AMANDA ESTEVES	MUNICIPIO DE BRAGANCA PAULISTA	SERVI??OS PREFEITURAS	PD251591	T0	Ativo		2025-12-17 03:00:00	2026-12-16 03:00:00	\N	1245589.32	0.00	0.00	1245589.32	0.00	PREFEITURA CADASTRO				E0251705											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
521	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD021143	T04	Ativo		2025-12-23 03:00:00	2026-12-22 03:00:00	\N	220986.36	0.00	0.00	220986.36	0.00	HOSPEDAGEM VIRTUALIZADA				E0210176											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
522	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE GARCA	SERVI??OS PREFEITURAS	PD024727	T01	Ativo		2025-12-30 03:00:00	2026-12-29 03:00:00	\N	32220.00	0.00	0.00	32220.00	0.00	PREFEITURA CADASTRO				E0240727											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
523	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD022426	T03	Ativo		2026-01-03 03:00:00	2027-01-02 03:00:00	\N	1132.71	0.00	0.00	1132.71	0.00	PROGRAMA SP SEM PAPEL				E0220862											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
524	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD025279	T0	Ativo		2025-10-07 03:00:00	2027-01-06 03:00:00	\N	31800948.15	0.00	0.00	31800948.15	0.00	DESENVOLVIMENTO, MANUTEN????O E SUSTENTA????O DESISTEMAS				E0250337											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
525	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024214	T01	Ativo		2025-11-22 03:00:00	2027-02-21 03:00:00	\N	28587.00	0.00	0.00	28587.00	0.00	SAM PATRIMONIO				E0240289											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
526	DAIANE DA SILVA SOUZA	MUNICIPIO DE UBATUBA	SERVI??OS PREFEITURAS	PD024618	T02	Ativo		2026-06-28 03:00:00	2027-06-27 03:00:00	\N	632400.00	0.00	0.00	632400.00	0.00	PREFEITURA CADASTRO				E0240618											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
527	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD024226	T0	Ativo		2025-09-29 03:00:00	2027-09-28 03:00:00	\N	51015302.72	0.00	0.00	51015302.72	0.00	INFRAESTRUTURA OCUPACIONAL				E0240344											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
528	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD0251521	T0	Ativo		2025-10-07 03:00:00	2027-10-06 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PLATAFORMA COLABORATIVA II				E0251638											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
529	NADIA BERTUCCELLI	MUNICIPIO DE PEDERNEIRAS	SERVI??OS PREFEITURAS	PD025137	T0	Ativo		2025-02-24 03:00:00	2030-02-23 03:00:00	\N	57996.00	5949.96	0.00	52046.04	0.00	PREFEITURA - CADASTRO				E0250159											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
530	DAIANE DA SILVA SOUZA	MUNICIPIO DE ITAPETININGA	SERVI??OS PREFEITURAS	PD251018	T0	Ativo		2025-03-27 03:00:00	2030-03-26 03:00:00	\N	998640.00	57106.32	0.00	941533.68	0.00	PREFEITURA - CADASTRO				E0251022											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
531	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD025168	T0	Ativo		2025-07-22 03:00:00	2030-07-21 03:00:00	\N	9720110.40	481382.94	0.00	9238727.46	0.00	DESENVOLVIMENTOE MANUTEN????O DO SISTEMA DE PROCESSO ELETRONICO "e-TCESP"				E0250194		359.00003833/2025-20									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
532	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MORUNGABA	SERVI??OS PREFEITURAS	PD251492	T0	Ativo		2025-10-08 03:00:00	2030-10-07 03:00:00	\N	193320.00	644.40	0.00	192675.60	0.00	PREFEITURA CADASTRO				E0251606											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
533	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD024093	T0	Ativo		2024-04-25 03:00:00	2025-04-24 03:00:00	\N	348900.33	178780.65	0.00	170119.68	0.00	NUVEM PRODESP - PAAS BANCO DE DADOS MICROSOFT SQL E  CERTIFICADO SSL STANDARD				E0240142	Assinado	359.00003454/2024-59									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
534	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023039	T01	Ativo		2024-04-26 03:00:00	2025-04-25 03:00:00	\N	102660.00	51064.19	0.00	51595.81	0.00	GERENCIAMENTO ANTIVIRUS				E0230046	Assinado	359.00004152/2024-06									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
535	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MOGI-GUACU	SERVI??OS PREFEITURAS	PD023609	T02	Ativo		2024-04-28 03:00:00	2025-04-27 03:00:00	\N	885000.00	130879.05	0.00	754120.95	0.00	PREFEITURA - CADASTRO				E0230609	Assinado	359.00005450/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
536	NADIA BERTUCCELLI	MUNICIPIO DE SANTA RITA DO PASSA QUATRO	SERVI??OS PREFEITURAS	PD023644	T02	Ativo		2024-04-28 03:00:00	2025-04-27 03:00:00	\N	34950.00	4194.00	0.00	30756.00	0.00	PREFEITURA - CADASTRO				E0230644	Assinado  	359.00003642/2024-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
537	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA FE DO SUL	SERVI??OS PREFEITURAS	PD024603	T0	Ativo		2024-04-29 03:00:00	2025-04-28 03:00:00	\N	20303.99	12667.44	0.00	7636.55	0.00	PREFEITURA - CADASTRO				E0240603	Assinado  	359.00003474/2024-20									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
538	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD022463	T01	Ativo		2024-04-30 03:00:00	2025-04-29 03:00:00	\N	2123899.44	543750.68	0.00	1580148.76	0.00	NUVEM PUBLICA				E0220907	Assinado	359.00000254/2023-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
540	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD022485	T01	Ativo		2024-05-09 03:00:00	2025-05-08 03:00:00	\N	483071.41	87856.64	0.00	395214.77	0.00	SISTEMA CADASTRAMENTO DE MULTAS				E0220936	Assinado	359.00000026/2023-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
541	LUCIANO PACHECO	SP CASA CIVIL	CASA CIVIL	PD025170	T05	Ativo		2024-11-09 03:00:00	2025-05-08 03:00:00	\N	21336809.85	4680359.30	0.00	16656450.55	0.00	SUPORTE A USUARIOS, ADMINISTRA????O DE REDES E AMBIENTE E GEST??O DE OPERA????ES DE T				E0250196 APP\nE0250197 ITO\nE0250198 ITO	Assinado (Renovado no PD025170)	359.00002428/2025-94									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
542	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD021252	T02	Ativo		2024-05-11 03:00:00	2025-05-10 03:00:00	\N	1139562.80	358137.20	0.00	781425.60	0.00	CONSULTORIA ESPECIALIZADA EM GEST??O DE TECNOLOGIA DA INFORMA????O				E0210327	Assinado	259.00000002/2023-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
543	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SUZANO	SERVI??OS PREFEITURAS	PD024606	T0	Ativo		2024-05-14 03:00:00	2025-05-13 03:00:00	\N	2061790.80	779899.50	0.00	1281891.30	0.00	PREFEITURA - CADASTRO				E0240606	Assinado  	359.00003630/2024-52									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
544	NADIA BERTUCCELLI	MUNICIPIO DE AVARE	SERVI??OS PREFEITURAS	PD023638	T02	Ativo		2024-05-16 03:00:00	2025-05-15 03:00:00	\N	332160.00	63216.64	0.00	268943.36	0.00	PREFEITURA - CADASTRO				E0230638	Assinado  	359.00002889/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
545	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD022112	T0	Ativo		2022-11-17 03:00:00	2025-05-16 03:00:00	\N	64173.65	3085.04	0.00	61088.61	0.00	PROGRAMA SP SEM PAPEL				E0220149	Assinado	359.00002743/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
546	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD024112	T0	Ativo		2024-05-14 03:00:00	2025-05-13 03:00:00	\N	154284.48	70705.81	0.00	83578.67	0.00	SERVI??O DE GEST??O CENTRALIZADA  - OUTSOURCING				E0240165	Assinado	359.00003903/2024-69									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
548	DAIANE DA SILVA SOUZA	MUNICIPIO DE MONTE MOR	SERVI??OS PREFEITURAS	PD022516	T03	Ativo		2024-05-17 03:00:00	2025-05-16 03:00:00	\N	53260.80	19236.96	0.00	34023.84	0.00	PREFEITURA - CADASTRO				E0220516	Assinado  	359.00004999/2024-82									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
549	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD023077	T01	Ativo		2024-05-17 03:00:00	2025-05-16 03:00:00	\N	9495.25	1683.65	0.00	7811.60	0.00	FOLHA DE PAGAMENTO				E0230089	Assinado	359.00000808/2023-22									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
550	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD022412	T0	Ativo		2022-12-01 03:00:00	2025-05-31 03:00:00	\N	871273.20	63769.09	0.00	807504.11	0.00	PORTAL CORPORATIVO BASICO E SUSTENTA????O DO SITE				E0220846	Assinado	359.00003276/2025-47									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
551	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO ROQUE	SERVI??OS PREFEITURAS	PD023643	T02	Ativo		2024-06-01 03:00:00	2025-05-31 03:00:00	\N	371256.96	32678.25	0.00	338578.71	0.00	PREFEITURA - CADASTRO				E0230643	Assinado  	359.00005351/2024-23									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
552	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T03	Ativo		2025-03-04 03:00:00	2025-06-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	AMBIENTE DE HOSPEDAGEM  DOS SISTEMAS DAEE				E0230285	Assinado	359.00000105/2025-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
553	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD024171	T0	Ativo		2024-06-05 03:00:00	2025-06-04 03:00:00	\N	2844882.93	1995309.37	0.00	849573.56	0.00	INFRAESTRUTURA CETTPRO				E0240281	Assinado	359.00003119/2023-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
554	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD022266	T01	Ativo		2024-03-08 03:00:00	2025-06-07 03:00:00	\N	1192365.30	191481.46	0.00	1000883.84	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES -HELPDESK				E0220357	Assinado	359.00000135/2024-91  									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
555	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022392	T01	Ativo		2024-12-08 03:00:00	2025-06-07 03:00:00	\N	4236264.56	3643716.26	0.00	592548.30	0.00	INFRAESTRUTURA VIRTUALIZADA  ON PREMISES, PAAS  BANCO DADOS ORCLE ENTERPREISE, PAAS WEBSPHRE,PROCESSAMENTO IBM, IMPRESS??O, SMTP E CERTIFICADO SSL STANDARD				E0220826	Assinado	359.00009212/2024-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
556	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022406	T03	Ativo		2024-12-08 03:00:00	2025-06-07 03:00:00	\N	474611.45	29092.05	0.00	445519.40	0.00	SISTEMA UNICO DE CADASTRO DE CARGOS E FUN????ES  E ATIVIDADES-SICAD				E0220839\nE0220840	Assinado	359.00009225/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
547	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE BOITUVA	PREFEITURA	PD251280	T0	Ativo	\N	2025-08-21 09:00:00	2027-08-20 09:00:00	\N	117597.60	0.00	0.00	117597.60	0.00	CIDADES.SP.GOV.BR	\N	\N	\N	E0251467	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
557	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD024012	T2 	Ativo		2023-12-08 03:00:00	2025-06-07 03:00:00	\N	6250746.34	720355.21	0.00	5530391.13	0.00	DESENVOLVIMENTO DE NOVOS  SISTEMAS DA CGE				E0240016	Assinado	359.00004569/2024-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
558	AMANDA ESTEVES	MUNICIPIO DE CONCHAL	SERVI??OS PREFEITURAS	PD024616	T0	Ativo		2024-06-21 03:00:00	2025-06-20 03:00:00	\N	25776.00	1288.80	0.00	24487.20	0.00	PREFEITURA - CADASTRO				E0240616	Renovado no ???PD251289	359.00006325/2025-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
559	DAIANE DA SILVA SOUZA	MUNICIPIO DE DOIS CORREGOS	SERVI??OS PREFEITURAS	PD024621	T0	Ativo		2024-06-21 03:00:00	2025-06-20 03:00:00	\N	27024.00	4323.84	0.00	22700.16	0.00	PREFEITURA - CADASTRO				E0240621	Assinado  	359.00004217/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
560	JUNEIDY SOLANGE BETECA JONY	AGENCIA PAULISTA DE PROMOCAO DE INVESTIMENTOS E COMPETITIVIDADE - INVESTE SAO PAULO	INVESTE SP	PD023204	T01	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	498.96	498.96	0.00	0.00	0.00	EMAIL COMO SERVI??O - OFFICE BASICO				E0230234	Renovado no PD251263	359.00006938/2023-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
561	DAIANE DA SILVA SOUZA	MUNICIPIO DE FRANCA	SERVI??OS PREFEITURAS	PD021721	T03	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	569520.00	144470.24	0.00	425049.76	0.00	PREFEITURA - CADASTRO				E0210721	Assinado  	359.00005664/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
562	NADIA BERTUCCELLI	MUNICIPIO DE TEODORO SAMPAIO	SERVI??OS PREFEITURAS	PD024611	T0	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	25776.00	2577.60	0.00	23198.40	0.00	PREFEITURA - CADASTRO				E0240611	Assinado  	359.00005627/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
563	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022346	T02	Ativo		2025-01-02 03:00:00	2025-07-01 03:00:00	\N	1215690.57	1050121.93	0.00	165568.64	0.00	MANUTEN????O  DOS SISTEMAS -RH FOLHA VIDA FUNCIONAL				E0250100 	Assinado	359.00000377/2025-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
564	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD022483	T0	Ativo		2023-01-02 03:00:00	2025-07-01 03:00:00	\N	75109.86	9839.92	0.00	65269.94	0.00	SAM ESTOQUE				E0220933\nE0220934	Assinado	359.0000.4033/2023-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
566	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE MEDICINA DE BOTUCATU	HCFMB	PD024040	T0	Ativo		2024-07-04 03:00:00	2025-07-03 03:00:00	\N	6953.22	2147.63	0.00	4805.59	0.00	PROGRAMA SP SEM PAPEL				E0240052	Assinado	359.00006138/2024-39									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
567	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD024155	T0	Ativo		2024-07-08 03:00:00	2025-07-07 03:00:00	\N	1717200.12	343441.67	0.00	1373758.45	0.00	OUTSOURCING E HOSPEDAGEM - AMBIENTE  IGC				E0240256	Assinado	359.0000.3427/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
568	LUCIANO PACHECO	SP CASA CIVIL	CASA CIVIL	PD025170	T06	Ativo		2025-05-09 03:00:00	2025-07-08 03:00:00	\N	21336809.85	4680359.30	0.00	16656450.55	0.00	DESENVOLVIMENTO, IMPLANTA????O E MANUTEN????O DE SISTEMAS				E0250196\nE0250197 \nE0250198	Assinado (Renovado no PD025170)										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
569	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD024245	T01	Ativo		2024-06-03 03:00:00	2025-06-02 03:00:00	\N	169.94	71.18	0.00	98.76	0.00	PROGRAMA SP SEM PAPEL				E0240374	Assinado	359.00004147/2024-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
572	DAIANE DA SILVA SOUZA	MUNICIPIO DE MOGI DAS CRUZES	SERVI??OS PREFEITURAS	PD022527	T02	Ativo		2024-07-14 03:00:00	2025-07-13 03:00:00	\N	1792920.00	383210.54	0.00	1409709.46	0.00	PREFEITURA - CADASTRO				E0220527	Assinado  	359.00006040/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
573	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD024217	T0	Ativo		2024-07-15 03:00:00	2025-07-14 03:00:00	\N	4489509.22	1122377.31	0.00	3367131.91	0.00	NUVEM P??BLICA				E0240331	Assinado	359.00004138/2024-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
574	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD022232	T1-T2	Ativo		2024-04-16 03:00:00	2025-07-15 03:00:00	\N	144780078.21	30156028.94	0.00	114624049.27	0.00	DESENVOLVIMENTO SISTEMA, MANUTEN????O SISTEMA,				E0220303	Assinado	359.00002790/2024-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
575	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA GERTRUDES	SERVI??OS PREFEITURAS	PD024653	T0	Ativo		2024-07-16 03:00:00	2025-07-15 03:00:00	\N	47376.00	5448.24	0.00	41927.76	0.00	PREFEITURA - CADASTRO				E0240653	Assinado  	359.00006072/2024-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
576	NADIA BERTUCCELLI	MUNICIPIO DE OSVALDO CRUZ	SERVI??OS PREFEITURAS	PD023649	T01	Ativo		2024-07-29 03:00:00	2025-07-28 03:00:00	\N	13788.00	2068.20	0.00	11719.80	0.00	PREFEITURA - CADASTRO				E0230649	Assinado  	359.00006510/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
577	NADIA BERTUCCELLI	MUNICIPIO DE RIBEIRAO BRANCO	SERVI??OS PREFEITURAS	PD023650	T01	Ativo		2024-07-30 03:00:00	2025-07-29 03:00:00	\N	10341.00	2585.25	0.00	7755.75	0.00	PREFEITURA - CADASTRO				E0230650	Assinado  	359.00006675/2024-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
579	ANA LIGIA SAPIENZA COLOMBO	FUNDO ESPECIAL DE DESPESA DO MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	FUND. MP	PD022137	T01	Ativo		2024-08-01 03:00:00	2025-07-31 03:00:00	\N	340304.35	51531.35	0.00	288773.00	0.00	CERTIFICADOS DIGITAIS				E0220178	Assinado	359.00006310/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
580	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE MEDICINA DE BOTUCATU	HCFMB	PD024202	T0	Ativo		2024-08-01 03:00:00	2025-07-31 03:00:00	\N	239116.80	40727.57	0.00	198389.23	0.00	FOLHA DE PAGAMENTO				E0240317	Assinado	359.0000.3181/2024-42									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
581	NADIA BERTUCCELLI	MUNICIPIO DE ITAPECERICA DA SERRA	SERVI??OS PREFEITURAS	PD024640	T0	Ativo		2024-08-02 03:00:00	2025-08-01 03:00:00	\N	1646880.00	304419.00	0.00	1342461.00	0.00	PREFEITURA - CADASTRO				E0240640	Contrato Assinado	359.00005910/2024-03									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
583	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD022198	T04	Ativo		2024-08-04 03:00:00	2025-08-03 03:00:00	\N	1467866.44	189453.53	0.00	1278412.91	0.00	NUVEM PRODESP				E0220255	Assinado	359.00004886/2025-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
584	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD023258	T02	Ativo		2024-08-04 03:00:00	2025-08-03 03:00:00	\N	37375.82	33262.42	0.00	4113.40	0.00	SISTEMA SAM - M??DULO PATRIMONIO				E0230295	Assinado	359.00003846/2023-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
578	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD021158	T03	Ativo	\N	2025-08-01 03:00:00	2026-07-31 03:00:00	\N	418047.84	117562.06	0.00	300485.78	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES E  PaaS BANCO DE DADOS MICROSOFT SQL	\N	\N	\N	E0210194	Assinado	359.00005447/2023-19	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
582	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD023186	T01	Ativo	\N	2025-08-03 03:00:00	2026-08-02 03:00:00	\N	446832.00	111708.00	0.00	335124.00	0.00	OFFICE B??SICO	\N	\N	\N	E0230214	Assinado	359.0000.3181/2024-42	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
570	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE IGUAPE	PREFEITURA	PD023244	T01	Ativo	\N	2024-06-20 09:00:00	2025-06-19 09:00:00	\N	76262.40	21395.79	0.00	54866.61	0.00	OFFICE BASICO E  EMAIL COMO SERVI??O	\N	\N	\N	E0230276	Assinado	359.00002708/2023-31	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
585	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE HORTOLANDIA	SERVI??OS PREFEITURAS	PD022557	T02	Ativo		2024-08-05 03:00:00	2025-08-04 03:00:00	\N	1216920.00	196157.85	0.00	1020762.15	0.00	PREFEITURA - CADASTRO				E0220557	Contrato Assinado	359.00006836/2024-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
586	NADIA BERTUCCELLI	MUNICIPIO DE MOGI-MIRIM	SERVI??OS PREFEITURAS	PD024654	T0	Ativo		2024-08-07 03:00:00	2025-08-06 03:00:00	\N	713744.52	71629.20	0.00	642115.32	0.00	PREFEITURA - CADASTRO				E0240654	Contrato Assinado	359.00006856/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
587	DAIANE DA SILVA SOUZA	MUNICIPIO DE SANTA CRUZ DAS PALMEIRAS	SERVI??OS PREFEITURAS	PD024669	T0	Ativo		2024-08-07 03:00:00	2025-08-06 03:00:00	\N	44841.60	1963.36	0.00	42878.24	0.00	PREFEITURA - SIM				E0240669	Contrato Assinado	359.00006509/2024-82									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
588	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITAPORANGA	SERVI??OS PREFEITURAS	PD024665	T0	Ativo		2024-08-08 03:00:00	2025-08-07 03:00:00	\N	13524.00	3955.77	0.00	9568.23	0.00	PREFEITURA - CADASTRO				E0240665	Contrato Assinado	359.00006390/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
589	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024063	T01	Ativo		2025-02-08 03:00:00	2025-08-07 03:00:00	\N	1036311.02	512609.70	0.00	523701.32	0.00	FOLHA DE PAGAMENTO				E0240093	Assinado	359.00005429/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
590	NADIA BERTUCCELLI	MUNICIPIO DE ASSIS	SERVI??OS PREFEITURAS	PD022542	T02	Ativo		2024-08-10 03:00:00	2025-08-09 03:00:00	\N	516480.00	54398.04	0.00	462081.96	0.00	PREFEITURA - CADASTRO				E0220542	Contrato Assinado	359.00007063/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
591	DAIANE DA SILVA SOUZA	MUNICIPIO DE ILHA COMPRIDA	SERVI??OS PREFEITURAS	PD023656	T01	Ativo		2024-08-10 03:00:00	2025-08-09 03:00:00	\N	40356.00	4013.18	0.00	36342.82	0.00	PREFEITURA - CADASTRO				E0230656	Contrato Assinado	359.00006694/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
592	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	UNIVESP	PD022284	T02	Ativo		2024-08-11 03:00:00	2025-08-10 03:00:00	\N	2896439.28	347435.58	0.00	2549003.70	0.00	NUVEM PUBLICA				E0220373	Assinado	359.00004103/2023-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
593	NADIA BERTUCCELLI	MUNICIPIO DE PARANAPANEMA	SERVI??OS PREFEITURAS	PD023669	T01	Ativo		2024-08-13 03:00:00	2025-08-12 03:00:00	\N	17220.00	2215.64	0.00	15004.36	0.00	PREFEITURA - CADASTRO				E0230669	Contrato Assinado	359.00005493/2023-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
594	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ARTUR NOGUEIRA	SERVI??OS PREFEITURAS	PD024666	T0	Ativo		2024-08-13 03:00:00	2025-08-12 03:00:00	\N	135240.00	11427.78	0.00	123812.22	0.00	PREFEITURA - CADASTRO				E0240666	Contrato Assinado	359.00006402/2024-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
595	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023153	T01	Ativo		2024-08-14 03:00:00	2025-08-13 03:00:00	\N	287247.64	48302.01	0.00	238945.63	0.00	FOLHA DE PAGAMENTO				E0230179	Assinado	359.00003502/2023-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
596	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD024161	T1	Ativo		2024-08-14 03:00:00	2025-08-13 03:00:00	\N	253650.60	54087.48	0.00	199563.12	0.00	PROGRAMA SP SEM PAPEL				E0240269	Assinado	359.00002640/2024-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
597	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD023093	T0	Ativo		2024-08-15 03:00:00	2025-08-14 03:00:00	\N	217865.17	13941.79	0.00	203923.38	0.00	SUSTENTA????O DO SISTEMA DE CADASTRO DE VEICULOS DE COMUNICA????O  - INFRAESTRUTURA COMPUTACIONAL PARA O SISTEMA MIDIACAD -SECOM,				E0230109\nE0230110\nE0230322	Assinado	359.00009162/2023-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
598	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD024140	T0	Ativo		2024-08-15 03:00:00	2025-08-14 03:00:00	\N	5347253.34	119806.39	0.00	5227446.95	0.00	DESENVOLVIMENTO/IMPLEMENTA????O DO PROJETO "PLATAFORMA DE DADOS DE TRANSITO"				E0240236	Assinado	359.00004274/2024-94									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
599	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE EMBU DAS ARTES	SERVI??OS PREFEITURAS	PD023666	T01	Ativo		2024-08-16 03:00:00	2025-08-15 03:00:00	\N	1504020.00	167219.08	0.00	1336800.92	0.00	PREFEITURA - CADASTRO				E0230666	Assinado	359.00008668/2023-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
600	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023157	T01	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	606208.80	90046.12	0.00	516162.68	0.00	MANUTEN????O DAS FUNCIONALIDADES DOS SISTEMAS DO MODULO DE GERENCIAMENTO DO PROJETO DE SECURITIZA????O  DO PPI- ICM/CMS DO ESTADO DE S??O PAULO				E0230184	Assinado	359.00005531/2023-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
601	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023158	T01	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	9999695.04	1576715.02	0.00	8422980.02	0.00	MANUTEN????O DAS FUNCIONALIDADES DOS SISTEMAS QUE PERMITIR??O O GERENCIAMENTO E CONTROLE DA DIVIDA ATIVA ESTADUAL				E0230185	Assinado	359.00005532/2023-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
602	DAIANE DA SILVA SOUZA	MUNICIPIO DE JABOTICABAL	SERVI??OS PREFEITURAS	PD024645	T0	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	148020.00	10961.00	0.00	137059.00	0.00	PREFEITURA - CADASTRO				E0240645	Assinado	359.00006495/2024-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
603	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	UNIVESP	PD024290	T0	Ativo		2024-08-30 03:00:00	2025-08-29 03:00:00	\N	7116.62	984.24	0.00	6132.38	0.00	SAM PATRIMONIO				E0240427	Assinado	359.00007242/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
604	NADIA BERTUCCELLI	MUNICIPIO DE CRAVINHOS	SERVI??OS PREFEITURAS	PD023689	T01	Ativo		2024-08-31 03:00:00	2025-08-30 03:00:00	\N	16531.20	2537.08	0.00	13994.12	0.00	PREFEITURA - CADASTRO				E0230689	Assinado	359.00006613/2023-96									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
605	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DE CAMPINAS - AGEMCAMP	AGEMCAMP	PD021223	T03	Ativo		2024-08-31 03:00:00	2025-08-30 03:00:00	\N	2888.38	218.92	0.00	2669.46	0.00	FOLHA DE PAGAMENTO				E0210287	Assinado	359.0000.5167/2023-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
606	DAIANE DA SILVA SOUZA	MUNICIPIO DE JUNDIAI	SERVI??OS PREFEITURAS	PD021734	T03	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	2586600.00	276230.94	0.00	2310369.06	0.00	PREFEITURA - CADASTRO				E0210734	Assinado	359.00007142/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
607	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA BARBARA D'OESTE	SERVI??OS PREFEITURAS	PD021737	T03	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	666840.00	55787.66	0.00	611052.34	0.00	PREFEITURA - CADASTRO				E0210737	Assinado	359.00007251/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
608	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD024207	T0	Ativo		2024-09-13 03:00:00	2025-09-12 03:00:00	\N	4341.60	4341.60	0.00	0.00	0.00	E-MAIL COMO SERVI??O				E0240322	Assinado (renovado no PD251133)										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
609	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD024323	T0	Ativo		2024-09-13 03:00:00	2025-09-12 03:00:00	\N	291.97	35.33	0.00	256.64	0.00	PROGRAMA SP SEM PAPEL				E0240466	Assinado	359.0000.7715/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
610	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD019238	T04	Ativo		2024-09-14 03:00:00	2025-09-13 03:00:00	\N	1157948.34	831862.32	0.00	326086.02	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISSES AVAN??ADO COM GERENCIAMENTO				E0190304	Assinado (Renovado no PD025277)	359.00002184/2023-88									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
611	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD020146	T04	Ativo		2024-09-14 03:00:00	2025-09-13 03:00:00	\N	130989.60	137539.08	0.00	-6549.48	0.00	NUVEM PRODESP				E0200175	Assinado (Renovado no PD025276)	359.00001594/2023-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
612	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	UNIVESP	PD024291	T0	Ativo		2024-09-14 03:00:00	2025-09-13 03:00:00	\N	7116.62	770.99	0.00	6345.63	0.00	SAM - ESTOQUE				E0240428	Assinado	359.00006928/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
613	NADIA BERTUCCELLI	MUNICIPIO DE ITAPOLIS	SERVI??OS PREFEITURAS	PD022551	T02	Ativo		2024-09-15 03:00:00	2025-09-14 03:00:00	\N	82656.00	12099.92	0.00	70556.08	0.00	PREFEITURA - CADASTRO				E0220551	 Assinado 	359.00007736/2024-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
614	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD022161	T02	Ativo		2024-09-16 03:00:00	2025-09-15 03:00:00	\N	103056.00	7943.90	0.00	95112.10	0.00	GESTAO INTRAGOV				E0220208	Assinado	359.00008555/2023-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
615	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ANGATUBA	SERVI??OS PREFEITURAS	PD024649	T00	Ativo		2024-09-16 03:00:00	2025-09-15 03:00:00	\N	10143.00	1352.40	0.00	8790.60	0.00	PREFEITURA - CADASTRO				E0240649	 Assinado 	359.00006518/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
616	AMANDA ESTEVES	MUNICIPIO DE VOTORANTIM	SERVI??OS PREFEITURAS	PD024677	T00	Ativo		2024-09-16 03:00:00	2025-09-15 03:00:00	\N	108672.00	10742.68	0.00	97929.32	0.00	PREFEITURA - CADASTRO				E0240677	 Assinado 	359.00006904/2024-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
617	DAIANE DA SILVA SOUZA	MUNICIPIO DE POA	SERVI??OS PREFEITURAS	PD023674	T01	Ativo		2024-09-17 03:00:00	2025-09-16 03:00:00	\N	986880.00	97220.24	0.00	889659.76	0.00	PREFEITURA - CADASTRO				E0230674	 Assinado 	359.00004614/2023-04									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
618	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PORTO FELIZ	SERVI??OS PREFEITURAS	PD024664	T01	Ativo		2024-09-17 03:00:00	2025-09-16 03:00:00	\N	135840.00	5309.08	0.00	130530.92	0.00	PREFEITURA - CADASTRO				E0240664	Assinado	359.00006533/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
619	JUNEIDY SOLANGE BETECA JONY	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	ITESP	PD024239	T0	Ativo		2024-09-18 03:00:00	2025-09-17 03:00:00	\N	528574.80	528574.80	0.00	0.00	0.00	E- MAIL COMO SERVI??O				E0240364	Assinado (Renovado no PD251148)	359.00004268/2025-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
620	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD024242	T0	Ativo		2024-09-18 03:00:00	2025-09-17 03:00:00	\N	18060.00	924.64	0.00	17135.36	0.00	PROGRAMA SP SEM PAPEL				E0240370	Assinado	359.00004244/2024-88									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
621	AMANDA ESTEVES	MUNICIPIO DE ANDRADINA	SERVI??OS PREFEITURAS	PD024671	T00	Ativo		2024-09-18 03:00:00	2025-09-17 03:00:00	\N	135840.00	4731.76	0.00	131108.24	0.00	PREFEITURA - CADASTRO				E0240671	Assinado	359.00006576/2024-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
622	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO MIGUEL ARCANJO	SERVI??OS PREFEITURAS	PD024688	T00	Ativo		2024-09-18 03:00:00	2025-09-17 03:00:00	\N	40752.00	3101.68	0.00	37650.32	0.00	PREFEITURA - CADASTRO				E0240688	Assinado	359.00007680/2024-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
623	DAIANE DA SILVA SOUZA	MUNICIPIO DE BANANAL	SERVI??OS PREFEITURAS	PD024693	T00	Ativo		2024-09-18 03:00:00	2025-09-17 03:00:00	\N	8150.40	1358.40	0.00	6792.00	0.00	PREFEITURA - CADASTRO				E0240693	Assinado	359.00008183/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
624	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024289	T0	Ativo		2024-09-14 03:00:00	2025-09-13 03:00:00	\N	241970.40	241970.40	0.00	0.00	0.00	OFFICE BASICO - EMAIL COMO SERVI??O				E0240426	Assinado (Renovado no PD251122)	359.00006933/2024-27									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
625	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO MEMORIAL DA AMERICA LATINA	MEMORIAL	PD024331	T0	Ativo		2024-09-19 03:00:00	2025-09-18 03:00:00	\N	5357.52	5342.64	0.00	14.88	0.00	E MAIL COMO SERVI??O - OFFICE  BASICO				E0240475	Renovado no PD251201	359.00006226/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
626	NADIA BERTUCCELLI	MUNICIPIO DE CAJATI	SERVI??OS PREFEITURAS	PD022544	T02	Ativo		2024-09-19 03:00:00	2025-09-18 03:00:00	\N	20664.00	1733.48	0.00	18930.52	0.00	PREFEITURA - CADASTRO				E0220544	Assinado	359.00008191/2024-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
627	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAPELA DO ALTO	SERVI??OS PREFEITURAS	PD022552	T02	Ativo		2024-09-19 03:00:00	2025-09-18 03:00:00	\N	41115.60	1229.19	0.00	39886.41	0.00	PREFEITURA - SIM				E0220552	Assinado	359.00008185/2024-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
628	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO MEMORIAL DA AMERICA LATINA	MEMORIAL	PD023130	T01	Ativo		2024-09-20 03:00:00	2025-09-19 03:00:00	\N	987.54	58.12	0.00	929.42	0.00	PROGRAMA SP SEM PAPEL				E0230153	Assinado	359.00006491/2023-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
629	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD020129	T05	Ativo		2024-09-21 03:00:00	2025-09-20 03:00:00	\N	193712.62	52103.20	0.00	141609.42	0.00	SERVI??OS SMS				E0200151	CLIENTE SOLICITOU O CANCELAMENTO DESTE CONTRATO. N??o ser?? prorrog/renov	359.00003131/2023-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
630	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITAPEVA	SERVI??OS PREFEITURAS	PD021730	T03	Ativo		2024-09-21 03:00:00	2025-09-20 03:00:00	\N	343560.00	36395.30	0.00	307164.70	0.00	PREFEITURA - CADASTRO				E0210730	Assinado	359.00007761/2024-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
631	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD023172	T01	Ativo		2024-09-21 03:00:00	2025-09-20 03:00:00	\N	40790.40	2436.18	0.00	38354.22	0.00	PROGRAMA SP SEM PAPEL				E0230200	Assinado	359.00007068/2023-55									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
632	NADIA BERTUCCELLI	MUNICIPIO DE MATAO	SERVI??OS PREFEITURAS	PD023675	T01	Ativo		2024-09-21 03:00:00	2025-09-20 03:00:00	\N	89544.00	1492.40	0.00	88051.60	0.00	PREFEITURA - CADASTRO				E0230675	Assinado	359.00006512/2023-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
633	DAIANE DA SILVA SOUZA	MUNICIPIO DE ITATIBA	SERVI??OS PREFEITURAS	PD021736	T03	Ativo		2024-09-22 03:00:00	2025-09-21 03:00:00	\N	321336.00	12859.92	0.00	308476.08	0.00	PREFEITURA - CADASTRO				E0210736	 Assinado 	359.00007796/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
634	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO SEBASTIAO	SERVI??OS PREFEITURAS	PD022563	T04	Ativo		2024-09-22 03:00:00	2025-09-21 03:00:00	\N	872160.00	129815.44	0.00	742344.56	0.00	PREFEITURA - CADASTRO				E0220563	 Assinado 	359.00008395/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
635	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD023112	T01	Ativo		2024-09-22 03:00:00	2025-09-21 03:00:00	\N	245874.24	3596.81	0.00	242277.43	0.00	NUVEM P??BLICA				E0230131	Assinado	359.00006593/2023-53									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
636	DAIANE DA SILVA SOUZA	MUNICIPIO DE DIADEMA	SERVI??OS PREFEITURAS	PD023676	T01	Ativo		2024-09-23 03:00:00	2025-09-22 03:00:00	\N	3029760.00	545154.20	0.00	2484605.80	0.00	PREFEITURA - CADASTRO				E0230676	Assinado	359.00007382/2023-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
637	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MONTE AZUL PAULISTA	SERVI??OS PREFEITURAS	PD024692	T00	Ativo		2024-09-24 03:00:00	2025-09-23 03:00:00	\N	9021.60	7904.64	0.00	1116.96	0.00	PREFEITURA - CADASTRO				E0240692	23/09 - E-mail do Thiago informando que o contrato n??o ser?? prorrogado  e n??o ?? para bloquear o sistema, pois a prefeitura ir?? fazer parte do Pacote Cidades	359.00008029/2024-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
638	NADIA BERTUCCELLI	EMP MUNIC DESENVOL URBANO RURAL DE BAURU	SERVI??OS PREFEITURAS	PD020763	T04	Ativo		2024-09-25 03:00:00	2025-09-24 03:00:00	\N	965070.00	530813.67	0.00	434256.33	0.00	PREFEITURA - CADASTRO				E0200763	Novo contrato PD251160	359.00007764/2024-42\n359.00004679/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
639	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD022150	T2-T3	Ativo		2024-09-26 03:00:00	2025-09-25 03:00:00	\N	3996676.82	36536.72	0.00	3960140.10	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES E PAAS MIDDLEWARE				E0220194	 Assinado 	359.00003428/2023-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
640	LUCIANO PACHECO	CODERP CIA DE DESENVOLVIMENTO ECONOMICO DE RIB PRETO	CODERP	PD024393	T0	Ativo		2024-09-26 03:00:00	2025-09-25 03:00:00	\N	1131900.00	226380.00	0.00	905520.00	0.00	OFFICE B??SICO				E0240547	Assinado (Renovado no ???PD251306)	359.00007964/2024-03									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
641	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAIEIRAS	SERVI??OS PREFEITURAS	PD024651	T00	Ativo		2024-09-26 03:00:00	2025-09-25 03:00:00	\N	135840.00	9089.96	0.00	126750.04	0.00	PREFEITURA - CADASTRO				E0240651	 Assinado 	359.00008645/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
642	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD021340	T04	Ativo		2024-09-27 03:00:00	2025-09-26 03:00:00	\N	10258.08	854.84	0.00	9403.24	0.00	SAM ESTOQUE				E0210445	Assinado	??359.00005157/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
643	RODRIGO BORGHESE TAMBASCO	DESENVOLVE SP - AGENCIA DE FOMENTO DO ESTADO DE SAO PAULO S.A.	DESENVOLVE SP	PD022302	T0	Ativo		2022-09-30 03:00:00	2025-09-29 03:00:00	\N	3296777.40	217600.27	0.00	3079177.13	0.00	DAAS DESKTOP AVANCADO,PLUS E NOTEBOOK ULTRAFINO				E0220395	Contrato Encerrado	359.00004095/2024-57									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
644	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023379	T01	Ativo		2024-09-30 03:00:00	2025-09-29 03:00:00	\N	39106.68	3104.59	0.00	36002.09	0.00	PROGRAMA SP SEM PAPEL				E0230462	Assinado	359.00006937/2023-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
645	JUNEIDY SOLANGE BETECA JONY	C E C M DOS TRAB.DA CIA PROC.DADOS EST.SP CREDIPRODESP	CREDIPRODESP	PD024335	T01	Ativo		2025-06-30 03:00:00	2025-09-29 03:00:00	\N	1565.12	1565.12	0.00	0.00	0.00	OFFICE INTERMEDIARIO				E0240479	Renovado no PD251597??	359.00006387/2024-24						PD251597			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
646	AMANDA ESTEVES	MUNICIPIO DE PEDREIRA	SERVI??OS PREFEITURAS	PD020644	T04	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	62258.40	44873.07	0.00	17385.33	0.00	PREFEITURA - SIM				E0200644	Assinado	359.00008676/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
647	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO PEDRO	SERVI??OS PREFEITURAS	PD020647	T04	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	15410.40	14798.60	0.00	611.80	0.00	PREFEITURA - SIM				E0200647	Assinado	359.00008769/2024-92									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
648	NADIA BERTUCCELLI	MUNICIPIO DE BIRITIBA-MIRIM	SERVI??OS PREFEITURAS	PD020789	T04	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	3659.25	4615.50	0.00	-956.25	0.00	PREFEITURA - CADASTRO				E0200789	Assinado (Renovado no PD251500)	359.00008688/2024-92									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
649	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	SEADE	PD022123	T02	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	598349.97	98820.98	0.00	499528.99	0.00	PLATAFORMA DE INTELIGENCIA DIGITAL				E0220162	Contrato Encerrado	359.00006959/2023-94									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
650	DAIANE DA SILVA SOUZA	MUNICIPIO DE JARDINOPOLIS	SERVI??OS PREFEITURAS	PD023662	T01	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	110784.00	1384.80	0.00	109399.20	0.00	PREFEITURA - CADASTRO				E0230662	Assinado	359.00008106/2023-97									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
651	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MAUA	SERVI??OS PREFEITURAS	PD023677	T01	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	6835680.00	458702.91	0.00	6376977.09	0.00	PREFEITURA - CADASTRO				E0230677	Assinado	359.00006666/2023-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
652	ANA LIGIA SAPIENZA COLOMBO	FUNDO ESPECIAL DE DESPESA DO MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	FUND. MP	PD025169	T0	Ativo		2025-05-01 03:00:00	2025-09-30 03:00:00	\N	26115.00	26115.00	0.00	0.00	0.00	COPILOT				E0250195	Assinado	359.00002587/2025-99									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
653	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD024325	T01	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	1215166.78	1215166.78	0.00	0.00	0.00	OFFICE  BASICO  E INTERMEDIARIO				E0240468	Assinado	359.00007051/2024-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
654	NADIA BERTUCCELLI	MUNICIPIO DE CARAGUATATUBA	SERVI??OS PREFEITURAS	PD020790	T04	Ativo		2024-10-02 03:00:00	2025-10-01 03:00:00	\N	822437.16	657980.97	0.00	164456.19	0.00	PREFEITURA - CADASTRO				E0200790	Assinado (Renovado no PD251082)	359.00003508/2025-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
655	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CAPAO BONITO	SERVI??OS PREFEITURAS	PD024694	T0	Ativo		2024-10-02 03:00:00	2025-10-01 03:00:00	\N	67560.00	957.10	0.00	66602.90	0.00	PREFEITURA - CADASTRO				E0240694	Assinado	359.00008250/2024-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
656	NADIA BERTUCCELLI	MUNICIPIO DE SAO LUIZ DO PARAITINGA	SERVI??OS PREFEITURAS	PD024697	T0	Ativo		2024-10-02 03:00:00	2025-10-01 03:00:00	\N	13512.00	1553.88	0.00	11958.12	0.00	PREFEITURA - CADASTRO				E0240697	Assinado	359.00008453/2024-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
657	BARBARA ALMEIDA TUNES FERNANDES	CORPO DE BOMBEIROS DA POLICIA MILITAR DO ESTADO DE SAO PAULO	BOMBEIROS	PD022475	T01	Ativo		2024-10-03 03:00:00	2025-10-02 03:00:00	\N	5244986.70	388192.93	0.00	4856793.77	0.00	IAAS AVAN??ADA - PAAS - SMTP - CERTIFICADO SSL STANDAR - OV				E0220919\nE0220921	Assinado	359.00006583/2023-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
658	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA ISABEL	SERVI??OS PREFEITURAS	PD024701	T0	Ativo		2024-10-03 03:00:00	2025-10-02 03:00:00	\N	517920.00	14201.20	0.00	503718.80	0.00	PREFEITURA - CADASTRO				E0240701	Assinado	359.00008603/2024-76									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
659	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD024037	T0	Ativo		2024-10-03 03:00:00	2025-10-02 03:00:00	\N	846.54	141.08	0.00	705.46	0.00	PROGRAMA SP SEM PAPEL				E0240049	Assinado	359.00008053/2024-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
660	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD021141	T04	Ativo		2024-10-04 03:00:00	2025-10-03 03:00:00	\N	10466284.99	553601.55	0.00	9912683.44	0.00	FOLHA DE PAGAMENTO				E0210174	Assinado	359.00006611/2023-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
661	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA ROSA DE VITERBO	SERVI??OS PREFEITURAS	PD024660	T0	Ativo		2024-10-08 03:00:00	2025-10-07 03:00:00	\N	38664.00	8441.64	0.00	30222.36	0.00	PREFEITURA - CADASTRO				E0240660	Contrato Rescindido	359.00006328/2024-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
662	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD022239	T01	Ativo		2024-10-09 03:00:00	2025-10-08 03:00:00	\N	33.23	1.96	0.00	31.27	0.00	PROGRAMA SP SEM PAPEL				E0220313	Assinado	359.00007087/2023-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
663	AMANDA ESTEVES	FUNDO MUNICIPAL DE TRANSITO - FUMTRAN	SERVI??OS PREFEITURAS	PD023673	T01	Ativo		2024-10-09 03:00:00	2025-10-08 03:00:00	\N	10752.00	7571.20	0.00	3180.80	0.00	PREFEITURA - CADASTRO				E0230673	Assinado (Renovado no PD251594)	359.00007155/2023-11						PD251594			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
824	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE APIAI	SERVI??OS PREFEITURAS	PD022806	T03	Ativo		2025-03-22 03:00:00	2026-03-21 03:00:00	\N	23004.00	5982.15	0.00	17021.85	0.00	PREFEITURA - SIM				E0220806		359.00004302/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
664	JUNEIDY SOLANGE BETECA JONY	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	ITESP	PD024163	T0	Ativo		2024-10-09 03:00:00	2025-10-08 03:00:00	\N	3271.03	209.45	0.00	3061.58	0.00	PROGRAMA SP SEM PAPEL				E0240271	Assinado	359.00002086/2023-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
665	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE NOVA CAMPINA	SERVI??OS PREFEITURAS	PD024683	T0	Ativo		2024-10-10 03:00:00	2025-10-09 03:00:00	\N	7732.80	7732.80	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240683	Assinado	359.00007436/2024-46						PD251650			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
666	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023324	T01	Ativo		2024-10-16 03:00:00	2025-10-15 03:00:00	\N	850545.05	35267.08	0.00	815277.97	0.00	NUVEM P??BLICA E MIDDLEWARE				E0230395	Assinado	359.00003158/2023-77									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
667	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SARAPUI	SERVI??OS PREFEITURAS	PD024686	T0	Ativo		2024-10-16 03:00:00	2025-10-15 03:00:00	\N	8107.20	675.60	0.00	7431.60	0.00	PREFEITURA - CADASTRO				E0240686	Assinado	359.00007519/2024-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
668	DAIANE DA SILVA SOUZA	MUNICIPIO DE ESPIRITO SANTO DO PINHAL	SERVI??OS PREFEITURAS	PD024691	T0	Ativo		2024-10-16 03:00:00	2025-10-15 03:00:00	\N	50670.00	1024.66	0.00	49645.34	0.00	PREFEITURA - CADASTRO				E0240691	Assinado	359.00008017/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
669	NADIA BERTUCCELLI	MUNICIPIO DE BARRA BONITA	SERVI??OS PREFEITURAS	PD024703	T0	Ativo		2024-10-16 03:00:00	2025-10-15 03:00:00	\N	40536.00	1035.92	0.00	39500.08	0.00	PREFEITURA - CADASTRO				E0240703	Assinado	359.00008696/2024-39									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
670	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD021041	T01	Ativo		2024-10-07 03:00:00	2025-10-06 03:00:00	\N	430924.56	4730.09	0.00	426194.47	0.00	DESKTOP B??SICO e  AVAN??ADO				E0210055	Assinado	359.00005985/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
671	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD202016	T05	Ativo		2024-10-01 03:00:00	2025-09-30 03:00:00	\N	4479.12	436.98	0.00	4042.14	0.00	HOSPEDAGEM DO SITE "TODAS IN REDE"				E0202016	10/11 - n??o ser?? assinado	359.00008845/2023-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
672	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD023333	T01	Ativo		2024-10-02 03:00:00	2025-10-01 03:00:00	\N	8535.36	711.28	0.00	7824.08	0.00	SAM ESTOQUE - SAM PATRIMONIO				E0230405	Assinado	359.00006451/2023-96									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
673	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD020096	T03	Ativo		2024-10-15 03:00:00	2025-10-14 03:00:00	\N	8003.40	666.95	0.00	7336.45	0.00	SAM  ESTOQUE				E0200112	Assinado	359.00008367/2024-98 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
674	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD024244	T0	Ativo		2024-10-18 03:00:00	2025-10-17 03:00:00	\N	167080.61	6965.06	0.00	160115.55	0.00	PROGRAMA SP SEM PAPEL				E0240373	Assinado	 359.00009250/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
675	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024344	T0	Ativo		2024-10-18 03:00:00	2025-10-17 03:00:00	\N	1212083.53	18471.52	0.00	1193612.01	0.00	GUIA RH SEFAZ- DATA WAREHOUSE  E PROCESSAMENTO ALTO DESEMPENHO IBM E BI				E0240488\nE0240489	Assinado	359.00006619/2024-44									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
676	NADIA BERTUCCELLI	EMPRESA MUNICIPAL DE DESENVOLVIMENTO DE CAMPINAS S/A	SERVI??OS PREFEITURAS	PD024675	T0	Ativo		2024-10-18 03:00:00	2025-10-17 03:00:00	\N	5608267.80	5024535.93	0.00	583731.87	0.00	PREFEITURA - CADASTRO				E0240675	Assinado (Renovado no PD251165)	359.00006929/2024-69									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
677	DAIANE DA SILVA SOUZA	MUNICIPIO DE ADAMANTINA	SERVI??OS PREFEITURAS	PD024700	T0	Ativo		2024-10-18 03:00:00	2025-10-17 03:00:00	\N	67226.40	681.94	0.00	66544.46	0.00	PREFEITURA - SIM				E0240700	Assinado	359.00008581/2024-44									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
678	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD020225	T04	Ativo		2024-10-20 03:00:00	2025-10-19 03:00:00	\N	241300.44	118846.51	0.00	122453.93	0.00	HOSPEDAGEM VIRTUALIZADA N??O GERENCIADA (IaaS)				E0200292	Assinado (Renovado no PD025282)	359.00003670/2023-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
679	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD022305	T02	Ativo		2024-10-20 03:00:00	2025-10-19 03:00:00	\N	3849196.94	3849196.78	0.00	0.16	0.00	RETEN????O DE DADOS E BACKUP				E0220399	Contrato Encerrado	359.00006746/2023-62									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
680	NADIA BERTUCCELLI	MUNICIPIO DE MIRACATU	SERVI??OS PREFEITURAS	PD023678	T01	Ativo		2024-10-20 03:00:00	2025-10-19 03:00:00	\N	20772.00	692.40	0.00	20079.60	0.00	PREFEITURA - CADASTRO				E0230678	Assinado	359.00007500/2023-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
681	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023064	T02	Ativo		2025-06-26 03:00:00	2025-10-25 03:00:00	\N	62430.00	3452.46	0.00	58977.54	0.00	DECBENS - SISTEMA DE DECLARA????O DE BENS				E0230073	Assinado	359.00003065/2023-42									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
682	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD021235	T02	Ativo		2025-01-27 03:00:00	2025-10-26 03:00:00	\N	489200.40	87748.97	0.00	401451.43	0.00	DaaS-DESKTOP B??SICO e  PLUS				E0210309	14/10/2025 - CONTRATO N??O SERA PRORROGADO, EMAIL ENVIADO A SDE 	359.00010119/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
683	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE DOBRADA	SERVI??OS PREFEITURAS	PD024707	T0	Ativo		2024-10-28 03:00:00	2025-10-27 03:00:00	\N	7732.80	7732.80	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240707	15/10 N??o vai mais Prorrogar	359.00009344/2024-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
684	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD021270	T01	Ativo		2024-10-29 03:00:00	2025-10-28 03:00:00	\N	1292187.60	219854.42	0.00	1072333.18	0.00	DaaS- DESKTOP COMO SERVI??O				E0210353	Renovado no PD025892	359.00008838/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
685	DAIANE DA SILVA SOUZA	MUNICIPIO DE GUARIBA	SERVI??OS PREFEITURAS	PD020794	T04	Ativo		2024-10-30 03:00:00	2025-10-29 03:00:00	\N	38250.00	13489.50	0.00	24760.50	0.00	PREFEITURA - CADASTRO				E0200794	Est?? com a Andrea, ser?? um contrato novo\nEnviado para Andrea dia 29/08	359.00009190/2024-47									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
686	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE POTIRENDABA	SERVI??OS PREFEITURAS	PD024706	T0	Ativo		2024-10-30 03:00:00	2025-10-29 03:00:00	\N	33613.20	590.95	0.00	33022.25	0.00	PREFEITURA - SIM				E0240706	Assinado	359.00009400/2024-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
687	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD024272	T0	Ativo		2024-09-02 03:00:00	2025-12-01 03:00:00	\N	3302375.49	2697002.96	0.00	605372.53	0.00	CHATBOT, MANUTEN????O E AMBIENTE				E0240407	Ser?? absorvido por novo contrato e n??o precisa prorrogar  	359.00007790/2024-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
688	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD024378	T0	Ativo		2024-12-02 03:00:00	2025-12-01 03:00:00	\N	235951.20	59598.70	0.00	176352.50	0.00	NUVEM PRODESP				E0240530	Assinado	359.00009518/2024-25						PD0251365			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
689	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD023391	T01	Ativo		2024-12-04 03:00:00	2025-12-03 03:00:00	\N	8125716.79	4432376.23	0.00	3693340.56	0.00	NUVEM PUBLICA				E0230478	Assinado	359.00008386/2023-33									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
690	NADIA BERTUCCELLI	MUNICIPIO DE GUARATINGUETA	SERVI??OS PREFEITURAS	PD024713	T0	Ativo		2024-12-04 03:00:00	2025-12-03 03:00:00	\N	246960.00	189443.82	0.00	57516.18	0.00	PREFEITURA - CADASTRO				E0240713	Assinado	359.00010843/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
825	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD023010	T0	Ativo		2023-09-22 03:00:00	2026-03-21 03:00:00	\N	16724589.60	7562763.16	0.00	9161826.44	0.00	HOSPEDAGEM				ET230012		359.00004937/2023-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
691	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD023061	T0	Ativo		2023-06-04 03:00:00	2025-12-03 03:00:00	\N	18650.23	16082.82	0.00	2567.41	0.00	SAM PATRIMONIO				E0230070	Foi substitu??do pelo PD251173	359.00003013/2025-38 						PD251173			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
692	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024046	T0	Ativo		2024-12-05 03:00:00	2025-12-04 03:00:00	\N	1172050.48	712061.28	0.00	459989.20	0.00	SISTEMA PKC - MIGRA????O DE DADOS				E0240058\nE0240059	19/11 - esse contrato foi por "escopo" e n??o ser?? prorrogado (servi??o executado e conclu??do)	359.00008544/2023-55									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
693	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD021317	T03	Ativo		2024-12-06 03:00:00	2025-12-05 03:00:00	\N	5425881.68	876064.92	0.00	4549816.76	0.00	DESKTOP COMO SERVI??O- DaaS				E0210409	Ser?? descontinuado	359.00009404/2023-02 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
694	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD021360	T02	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	17234005.56	0.00	0.00	17234005.56	0.00	GED				E0210471	Assinado	359.00008567/2023-60									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
695	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023455	T01	Ativo		2024-12-12 03:00:00	2025-12-11 03:00:00	\N	3884393.14	2546010.81	0.00	1338382.33	0.00	NUVEM PRODESP - CERTIFICADO - FERRAMENTA DE MONITORAMENTO E SUPORTE TECNICO				E0230570\nE0230571	Assinado	359.00009547/2023-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
696	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD023018	T02	Ativo		2025-09-11 03:00:00	2026-09-10 03:00:00	\N	359164.89	30126.52	0.00	329038.37	0.00	SAM PATRIMONIO				E0230023											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
697	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024446	T0	Ativo		2024-12-05 03:00:00	2025-12-04 03:00:00	\N	7674994.78	3676353.26	0.00	3998641.52	0.00	SHIELD - INFRAESTRUTURA,  HOSPEDAGEM E SEGURAN??A DA INFORMA????O EM  NUVEM PUBLICA				E0241013	26/11 - Aguardando a devolu????o do cliente da minuta para assinatura da Prodesp.	359.00008671/2024-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
698	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD022451	T02	Ativo		2024-12-05 03:00:00	2025-12-04 03:00:00	\N	51124.76	24512.70	0.00	26612.06	0.00	NUVEM PRODESP				E0220894	Contrato encerrado	359.00008765/2023-23									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
699	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023469	T02	Ativo		2024-12-12 03:00:00	2025-12-11 03:00:00	\N	37188782.30	29282959.39	0.00	7905822.91	0.00	DESENVOLVIMENTO DE SISTEMAS				E0230590\nE0230591\nE0230592\nET230592	05/12/25 Cassio (Benato) solicitou ESP/PO do contrato prorrog ainda n??o assinado. MR enviou por email\n05/12/25 MR elab declara????o prorrog msm bases (assint Bruno e envio para Amauri dos Reis).\n04/12/25 entrou em pauta da DEX. Day informou que tiraram da pauta por conta da diverg no nome do sistema (escopo do contrato).	359.00008865/2023-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
700	DAIANE DA SILVA SOUZA	MUNICIPIO DE TARUMA	SERVI??OS PREFEITURAS	PD024714	T0	Ativo		2024-12-12 03:00:00	2025-12-11 03:00:00	\N	7732.80	7088.40	0.00	644.40	0.00	PREFEITURA - CADASTRO				E0240714	04/12 - Em processo de assinatura	359.00010130/2024-77									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
701	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024269	T0	Ativo		2024-12-13 03:00:00	2025-12-12 03:00:00	\N	48119.97	42499.23	0.00	5620.74	0.00	PAAS  MIDDLEWARE				E0240404	CONTRATO SER?? CANCELADO. N??O RENOV OU PRORROG.\n09/09/25 MR avisou Lari que estamos acompanhando com delivery o encerramento do contrato.	359.00010480/2024-33									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
702	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD024366	T0	Ativo		2024-12-13 03:00:00	2025-12-12 03:00:00	\N	7045782.92	6693279.07	0.00	352503.85	0.00	MIDDLEWARE E NUVEM P??BLICA				E0240513	Substitu??do pelo PD025288	359.00007133/2024-23						PD025288			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
703	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD020170	T03	Ativo		2024-09-14 03:00:00	2025-12-13 03:00:00	\N	1349447.80	94814.14	0.00	1254633.66	0.00	GUARDA DE DADOS DO HISTORICO DA FOLHA DE PAGAMENTO E SERVI??OS DE PROCESSAMENTO DE DADOS EM MAINFRAME IBM NO DATA CENTER PRODESP GUARDA DE DADOS 081				E0200212\nE0200213\nE0200282	04/12/25 - Encaminhado o Parecer da GJU para o cliente	359.00007503/2024-22						PD024326 			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
704	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DA BAIXADA SANTISTA - AGEM	AGEM	PD024001	T01	Ativo		2024-12-14 03:00:00	2025-12-13 03:00:00	\N	1968.48	1640.40	0.00	328.08	0.00	SAM PATRIMONIO				E0240001	08.12.2025 - BLOCO 2777292 - SOLICITEI DISPONIBILIZAR O BLOCO NA GOR - BLOCO INTERNO DISPONIBILIZA	359.00000814/2024-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
705	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD023424	T01	Ativo		2024-12-14 03:00:00	2025-12-13 03:00:00	\N	160413.12	116231.75	0.00	44181.37	0.00	SUPORTE T??CNICO				E0230522	Despacho do cliente informando que n??o tem mais interesse na renova????o do contrato	359.00008878/2023-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
706	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD024060	T0	Ativo		2024-12-16 03:00:00	2025-12-15 03:00:00	\N	29301.36	17575.56	0.00	11725.80	0.00	SAM - PATRIMONIO				E0240090\nE0240091	02/12/25 - Minuta conferida e respondido ao cliente para envio da vers??o final e bloco de assinatura	359.00011269/2024-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
707	NADIA BERTUCCELLI	MUNICIPIO DE FLORINEA	SERVI??OS PREFEITURAS	PD024720	T0	Ativo		2024-12-16 03:00:00	2025-12-15 03:00:00	\N	7732.80	7088.40	0.00	644.40	0.00	PREFEITURA - CADASTRO				E0240720	04/12 - Em processo de assinatura	359.00010935/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
708	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD024429	T0	Ativo		2024-12-16 03:00:00	2025-12-15 03:00:00	\N	102498.48	90540.32	0.00	11958.16	0.00	PROCESSAMENTO UNISYS - RPM				E0240594	19/11/2025 - cliente informa que o contrato ser?? encerrado - Delivery informado e deu ciencia 	359.00009122/2024-88									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
709	DAIANE DA SILVA SOUZA	MUNICIPIO DE BRAGANCA PAULISTA	SERVI??OS PREFEITURAS	PD020801	T04	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	1364400.00	803783.73	0.00	560616.27	0.00	PREFEITURA - CADASTRO				E0200801	03/12 - Aguardando retorno da ficha e da minuta	359.00011419/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
710	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD024302	T0	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	784684.80	653904.00	0.00	130780.80	0.00	SISTEMA DE GEST??O DE MATERIAIS  - SAM ESTOQUE  E  PATRIM??NIO				E0240440	Assinado	359.00005874/2024-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
711	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD024453	T0	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	17578.80	15332.63	0.00	2246.17	0.00	SAM ESTOQUE				E0241022	03/11/2025 - Proposta enviada para o cliente.	359.00008990/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
712	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD201003	T02	Ativo		2025-06-17 03:00:00	2025-12-16 03:00:00	\N	1963147.68	1280539.69	0.00	682607.99	0.00	GED				E0201003	03/12 -  Aguardando o envio da minuta da renova????o	359.00004833/2025-47									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
713	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE MEIO AMBIENTE INFRAESTRUTURA E LOGISTICA	SEMIL	PD023265	T01	Ativo		2024-12-18 03:00:00	2025-12-17 03:00:00	\N	4193426.69	3147579.55	0.00	1045847.14	0.00	NUVEM P??BLICA				E0230303	GJU 02/12	359.00009708/2023-61						PD251633 			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
714	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD023410	T0	Ativo		2023-12-18 03:00:00	2025-12-17 03:00:00	\N	5749925.02	1901880.10	0.00	3848044.92	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES, SMTP E OUTSOURCING				E0230506\nE0230507\nET230506	08/12/25 - Encaminhado PMC para assiantura  do contrato	359.00009224/2023-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
715	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD024428	T0	Ativo		2024-12-18 03:00:00	2025-12-17 03:00:00	\N	198907.14	103721.86	0.00	95185.28	0.00	SAM ESTOQUE - PATRIMONIO				E0240592\nE0240593	05/12/25 - Minuta corrigida. No aguardo do bloco de assinatura	359.00008323/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
716	JUNEIDY SOLANGE BETECA JONY	AGENCIA REGULADORA DE SERVICOS PUBLICOS DELEGADOS DE TRANSPORTE DO ESTADO DE SAO PAULO	ARTESP	PD024324	T0	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	32800.00	28049.85	0.00	4750.15	0.00	PROGRAMA SP SEM PAPEL				E0240467	09/12 - Reuni??o dia 09/12 da artesp para liberar a assinatura	359.00006288/2024-42									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
718	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD024334	T0	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	10406.88	8672.40	0.00	1734.48	0.00	SAM - ESTOQUE E PATRIM??NIO				E0240478	09/12 - Aguardando envio do bloco de assinatura	359.00006949/2024-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
719	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD024490	T0	Ativo		2024-12-18 03:00:00	2025-12-17 03:00:00	\N	619640.40	568003.70	0.00	51636.70	0.00	OFFICE  BASICO - INTERMEDIARIO, EMAIL COMO SERVI??O				E0241068	04/12/2025  - COBREI FERNANDO VENDAS MINUTA FINAL	011.00001274/2024-36						PD251606 			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
720	AMANDA ESTEVES	MUNICIPIO DE NOVA ODESSA	SERVI??OS PREFEITURAS	PD024718	T0	Ativo		2024-12-18 03:00:00	2025-12-17 03:00:00	\N	601200.00	120245.76	0.00	480954.24	0.00	PREFEITURA - CADASTRO				E0240718	Assinado	359.00010329/2024-03									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
721	NADIA BERTUCCELLI	MUNICIPIO DE SANTA CRUZ DA CONCEICAO	SERVI??OS PREFEITURAS	PD024719	T0	Ativo		2024-12-23 03:00:00	2025-12-22 03:00:00	\N	12817.44	9342.77	0.00	3474.67	0.00	PREFEITURA - SIM				E0240719	03/12 - Aguardando retorno da ficha e da minuta	359.00010331/2024-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
722	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD025029	T0	Ativo		2024-12-24 03:00:00	2025-12-23 03:00:00	\N	1513807.19	1019288.07	0.00	494519.12	0.00	DESENVOLVIMENTO E SUSTENTA????O DO PORTAL				E0250034\nE0250035	01/12/25 - Proposta reencamihada com as altera????es solicitadas pelo cliente	359.00010707/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
723	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD025034	T0	Ativo		2024-12-24 03:00:00	2025-12-23 03:00:00	\N	4423497.60	1655505.20	0.00	2767992.40	0.00	DATA LAKE - DESENVOLVIMENTO/EVOLU????O				E0250040\nE0250041	02/12/25 - Reiterado o pedido do bloco de assinatura ao cliente	359.00010828/2024-92									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
724	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD022362	T02	Ativo		2024-12-26 03:00:00	2025-12-25 03:00:00	\N	2645969.95	407949.95	0.00	2238020.00	0.00	NUVEM P??BLICA E INFRAESTRUTURA				E0220471\nET220471	09/12 -\tSolicitado minuta - aguardando envio	359.00009331/2023-41 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
725	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD024389	T0	Ativo		2024-12-26 03:00:00	2025-12-25 03:00:00	\N	56251.20	46876.00	0.00	9375.20	0.00	SAM ESTOQUE				E0240542	03/12 - Aguardando envio dos blocos SEI pelo DER\nPrevis??o de assinatura: Assim que os blocos forem liberados	359.00011421/2024-82									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
726	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD022416	T02	Ativo		2024-12-27 03:00:00	2025-12-26 03:00:00	\N	5910.94	5403.09	0.00	507.85	0.00	SAM PATRIMONIO				E0220851	PRODESP ASSINOU 04/12 - FALTA O CLIENTE ASSINAR	359.0000.9410/2024-32									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
727	DAIANE DA SILVA SOUZA	MUNICIPIO DE SANTO ANASTACIO	SERVI??OS PREFEITURAS	PD022577	T02	Ativo		2024-12-27 03:00:00	2025-12-26 03:00:00	\N	13608.00	9899.82	0.00	3708.18	0.00	PREFEITURA - CADASTRO				E0220577	04/12 - Em processo de assinatura	359.00011524/2024-42									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
728	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD024224	T0	Ativo		2024-12-27 03:00:00	2025-12-26 03:00:00	\N	3561.60	2968.00	0.00	593.60	0.00	E-MAIL COMO SERVI??O				E0240340	04/11/2025 - Cliente pede documenta????o\n14/11/2025 - Respondemos com documenta????o	359.00010200/2024-97						PD0251601			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
729	LUCIANO PACHECO	CONTROLADORIA GERAL DO ESTADO	CGE	PD024292	T0	Ativo		2024-12-27 03:00:00	2025-12-26 03:00:00	\N	2242.65	1420.01	0.00	822.64	0.00	PROGRAMA SP SEM PAPEL				E0240429	01/12/25 - Minuta conferida, informado os signatarios e autorizado o envio da minuta final para assinatura	359.00011542/2024-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
730	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD022141	T03	Ativo		2024-12-29 03:00:00	2025-12-28 03:00:00	\N	11683042.56	4712584.50	0.00	6970458.06	0.00	NOVOS  SISTEMAS DE INFORMA????O				E0220182	03/12 - Aguardando envio da documenta????o pelo DER\nPrevis??o de assinatura: 19/12/2025	359.00009589/2023-47									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
731	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD022211	T02	Ativo		2024-12-29 03:00:00	2025-12-28 03:00:00	\N	17936245.29	15897089.29	0.00	2039156.00	0.00	SUPORTE TECNICO ESPECIALIZADO ,INFRAESTRUITURA VIRTUALIZADA ON PREMISES, INTRAGOV,SINTONIA E VOIP				E0220271\nE0220272\nE0220273\nE0220277\nE0220278\nET220271\nET220278	03/12 - Documenta????o enviada pelo DER recebida, finalizando os tramites para seguirmos para assinatura do contrato.\nPrevis??o de assinatura: 10/12/2025	359.00009604/2023-57									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
732	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD023411	T0	Ativo		2023-12-29 03:00:00	2025-12-28 03:00:00	\N	8139832.33	1785040.44	0.00	6354791.89	0.00	PAAS BANCO DE DADOS MICROSOFT SQL, INFRAESTRUTURA VIRTUALIZADA ON PREMISES, CERTIFICADO SSL STANDARD -OV E SERVI??OS DE SUPORTE TECNICO				E0230508\nEC230508	08/12/25 - Incluido no PMC para assinatura do contrato	359.00009109/2023-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
733	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD024011	T0	Ativo		2024-12-30 03:00:00	2025-12-29 03:00:00	\N	8397290.40	6266590.74	0.00	2130699.66	0.00	NUVEM PUBLICA				E0240012	09/12 - Virou prorroga????o emergencial	359.00009213/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
734	MARTA MARIA NOVAES DE ALC??NTARA	SECRETARIA DE ESTADO DE EDUCACAO DE MINAS GERAIS	SEDUC-MG	PD024425	T0	Ativo		2024-12-30 03:00:00	2025-12-29 03:00:00	\N	30665198.84	30665198.84	0.00	0.00	0.00	OFFICE PLUS				E0240589	28/11 - Luciana informa que foi encaminhada nova proposta , por??m n??o recebemos o aceite da renova????o. 	359.00009131/2024-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
735	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD024474	T0	Ativo		2024-12-30 03:00:00	2025-12-29 03:00:00	\N	1676644.80	1397204.00	0.00	279440.80	0.00	OFFICE				E0241050	09/12 - Virou prorroga????o emergencial	359.00009131/2024-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
736	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD024449	T0	Ativo		2024-12-18 03:00:00	2025-12-17 03:00:00	\N	10406.88	9077.09	0.00	1329.79	0.00	SAM ESTOQUE				E0241017\nE0241018	09/12 - Aguardando envio do bloco de assinatura	359.00011173/2024-70									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
737	JUNEIDY SOLANGE BETECA JONY	SECRETARIA MUNICIPAL DE GESTAO - SMG	SMG	PD022310	T02	Ativo		2024-12-28 03:00:00	2025-12-27 03:00:00	\N	298906.38	84702.20	0.00	214204.18	0.00	CERTIFICADO SSL E SISTEMA DE TABELAS DE TEMPORALIDADE DE DOCUMENTOS				E0220406\nE0220407	08/12/25 - O cliente optou pela n??o prorroga????o, o servi??o ser?? prestado at?? o final da vig??ncia.	359.00009814/2023-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
738	JUNEIDY SOLANGE BETECA JONY	SECRETARIA MUNICIPAL DE EDUCACAO	SMEDU	PD021373	T01	Ativo		2023-12-30 03:00:00	2025-12-29 03:00:00	\N	22330431.60	20427097.60	0.00	1903334.00	0.00	WIFI E PONTOS DE REDE				E0210487	03/12 - V??o enviar os blocos para assinatura	359.0000.3522/2025-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
739	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD021273	T03	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	2951280.80	2039909.02	0.00	911371.78	0.00	FOLHA DE PAGAMENTO DESCENTRALIZADA				E0210357	02/12/2025 - Minuta aprovada, pedido para ajuste dos signat??rios PRODESP.	359.00000240/2024-21 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
740	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA CIVIL DO ESTADO DE SAO PAULO	DIPOL	PD022057	T02	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	159998093.79	126835307.71	0.00	33162786.08	0.00	DESENVOLVIMENTO DE SISTEMAS PARA CADEIRA DE CUST??DIA				E0220022\nE0220077\nE0220078\nE0220139\nE0220146\nE0220171\nET220022\nET220077\nET220078	09/12 - Minuta esta com CJ	359.00004746/2024-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
794	NADIA BERTUCCELLI	MUNICIPIO DE CAMPINA DO MONTE ALEGRE	SERVI??OS PREFEITURAS	PD025139	T0	Ativo		2025-02-26 03:00:00	2026-02-25 03:00:00	\N	7732.80	5799.60	0.00	1933.20	0.00	SISTEMA DE CADASTRO DE MULTAS				E0250161		359.00001414/2025-53									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
741	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE RPUSP	HCRPUSP	PD023041	T02	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	1238668.00	876981.44	0.00	361686.56	0.00	FOLHA DE PAGAMENTO				E0230048	PMC 02/12 - ASSINATURA	359.0000.9533/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
742	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023101	T03	Ativo		2025-07-01 03:00:00	2025-12-31 03:00:00	\N	7094397.71	2285508.16	0.00	4808889.55	0.00	INFRAESTRUTURA SOLUCAO ATTORNATUS E SISTEMAS PRECAT??RIOS				E0230120	Assinado	359.00003024/2023-56						PD025220			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
743	LUCIANO PACHECO	CASA MILITAR DO GABINETE DO GOVERNADOR	CASA MILITAR	PD023380	T02	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	1992.76	1646.90	0.00	345.86	0.00	PROGRAMA SP SEM PAPEL				E0230463	29/10/25 - Proposta encaminhada ao cliente	359.00005182/2023-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
744	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD023414	T01	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	634996.20	291039.93	0.00	343956.27	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0230512	Rescindido							PD025013			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
745	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024430	T0	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	1308958.80	1090799.00	0.00	218159.80	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0240595\nEB240595\nEC240595\nED240595\nEE240595\nEF240595\nEG240595\nEH240595\nEI240595\nEJ240595\nEK240595\nEL240595\nEM240595\nEN240595	03/12 - \tEquipe de Vendas (Michel). Prevista a assinatura em 30/12/2025	359.00010375/2024-02						PD251335			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
746	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO CARLOS	SERVI??OS PREFEITURAS	PD025063	T0	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	816000.00	627001.07	0.00	188998.93	0.00	PREFEITURA - CADASTRO				E0250077	08/12 - Aguardando retorno do cliente	359.00011486/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
747	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD021264	T03	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	63484.28	34892.22	0.00	28592.06	0.00	FOLHA DE PAGAMENTO DESCENTRALIZADA				E0210344	05/12/25 - cliente avaliou minuta e Tr e Debora pediu para eu aguardar via teams	359.00009614/2023-92 						PD251726			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
748	NADIA BERTUCCELLI	MUNICIPIO DE ITAPEVI	SERVI??OS PREFEITURAS	PD022506	T03	Ativo		2025-01-03 03:00:00	2026-01-02 03:00:00	\N	1025040.00	589411.26	0.00	435628.74	0.00	PREFEITURA - CADASTRO				E0220506	03/12 - Aguardando retorno da ficha e da minuta	359.00011258/2024-58									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
749	AMANDA ESTEVES	MUNICIPIO DE ATIBAIA	SERVI??OS PREFEITURAS	PD022805	T03	Ativo		2025-01-03 03:00:00	2026-01-02 03:00:00	\N	783240.00	713609.18	0.00	69630.82	0.00	PREFEITURA - CADASTRO				E0220805	Contrato Rescindido dia 29/09/2025	359.00009482/2024-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
750	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023107	T01	Ativo		2024-10-03 03:00:00	2026-01-02 03:00:00	\N	15724629.01	8576437.82	0.00	7148191.19	0.00	SISTEMA SAUDE EM REDE				E0230126	03/12 - Aguardando a minuta	359.00000894/2023-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
751	NADIA BERTUCCELLI	MUNICIPIO DE LINDOIA	SERVI??OS PREFEITURAS	PD021691	T04	Ativo		2025-01-04 03:00:00	2026-01-03 03:00:00	\N	199620.00	92089.82	0.00	107530.18	0.00	PREFEITURA - CADASTRO				E0210691	03/12 - Aguardando retorno da ficha e da minuta	359.00011639/2024-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
752	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024408	T0	Ativo		2025-01-04 03:00:00	2026-01-03 03:00:00	\N	102847.25	19454.62	0.00	83392.63	0.00	CERTIFICADO DIGITAL				E0240565	24/11/25 - Email cobrando a Susan da nova proposta. Informado que aguardando retorno da minuta para inicia????o do processo de assinatura do NOVO CONTRATO	359.00007962/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
753	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE MEIO AMBIENTE INFRAESTRUTURA E LOGISTICA	SEMIL	PD025053	T0	Ativo		2025-01-05 03:00:00	2026-01-04 03:00:00	\N	891693.60	733170.30	0.00	158523.30	0.00	OFFICE				E0250056	GJU 02/12	359.00011284/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
754	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BURITAMA	SERVI??OS PREFEITURAS	PD022811	T03	Ativo		2025-01-10 03:00:00	2026-01-09 03:00:00	\N	17424.00	6292.00	0.00	11132.00	0.00	PREFEITURA - CADASTRO				E0220811	03/12 - Aguardando retorno da ficha e da minuta	359.00011611/2024-08									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
755	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD023406	T01	Ativo		2025-01-12 03:00:00	2026-01-11 03:00:00	\N	6162.82	4955.27	0.00	1207.55	0.00	SAM ESTOQUE				E0230500\nE0230501	Assinado	359.00000471/2024-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
756	NADIA BERTUCCELLI	MUNICIPIO DE CAFELANDIA	SERVI??OS PREFEITURAS	PD021741	T04	Ativo		2025-01-13 03:00:00	2026-01-12 03:00:00	\N	8712.00	6572.72	0.00	2139.28	0.00	PREFEITURA - CADASTRO				E0210741	03/12 - Aguardando retorno da ficha e da minuta	359.00011619/2024-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
757	DAIANE DA SILVA SOUZA	MUNICIPIO DE PILAR DO SUL	SERVI??OS PREFEITURAS	PD022808	T03	Ativo		2025-01-13 03:00:00	2026-01-12 03:00:00	\N	25697.76	15909.32	0.00	9788.44	0.00	PREFEITURA - SIM				E0220808	03/12 - Aguardando retorno da ficha e da minuta	359.00000326/2025-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
758	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PDC22448		Ativo		2025-07-17 03:00:00	2026-01-16 03:00:00	\N	3679955.76	1652568.57	0.00	2027387.19	0.00	DESENVOLVIMENTO DE SISTEMAS				EC220891	03/12 - Em elabora????o do Kit Proposta	359.00003351/2023-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
759	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE DESENVOLVIMENTO SOCIAL	SEDS	PD024496	T0	Ativo		2025-01-18 03:00:00	2026-01-17 03:00:00	\N	7380.00	5592.35	0.00	1787.65	0.00	PROGRAMA SP SEM PAPEL				E0241074	03/12 - Aguardando envio dos blocos SEI pela SEDS\nPrevis??o de assinatura: Assim que os blocos forem liberados	359.00009869/2024-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
760	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CESARIO LANGE	SERVI??OS PREFEITURAS	PD021654	T03	Ativo		2025-01-19 03:00:00	2026-01-18 03:00:00	\N	11680.80	7073.29	0.00	4607.51	0.00	PREFEITURA - SIM				E0210654	03/12 - Aguardando retorno da ficha e da minuta	359.00000111/2025-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
762	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ALTINOPOLIS	SERVI??OS PREFEITURAS	PD023603	T02	Ativo		2025-01-24 03:00:00	2026-01-23 03:00:00	\N	8222.40	7206.02	0.00	1016.38	0.00	PREFEITURA - CADASTRO				E0230603	03/12 - Aguardando retorno da ficha e da minuta	359.00000472/2025-60									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
763	NADIA BERTUCCELLI	MUNICIPIO DE CERQUEIRA CESAR	SERVI??OS PREFEITURAS	PD024647	T0	Ativo		2025-01-24 03:00:00	2026-01-23 03:00:00	\N	11728.08	6196.98	0.00	5531.10	0.00	PREFEITURA - CADASTRO				E0240647	03/12 - Aguardando retorno da ficha e da minuta	359.00011107/2024-08									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
764	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023064	T03	Ativo		2025-10-26 03:00:00	2026-01-25 03:00:00	\N	62430.00	3452.46	0.00	58977.54	0.00	DECBENS - SISTEMA DE DECLARA????O DE BENS				E0230073	04/12 - Aguardando renova????o do unificado										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
765	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE JAHU	SERVI??OS PREFEITURAS	PD023694	T01	Ativo		2025-01-27 03:00:00	2026-01-26 03:00:00	\N	388080.00	61668.00	0.00	326412.00	0.00	PREFEITURA - CADASTRO				E0230694	03/12 - Aguardando retorno da ficha e da minuta	359.00000315/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
766	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD023352	T01	Ativo		2025-01-29 03:00:00	2026-01-28 03:00:00	\N	3996527.84	2982044.12	0.00	1014483.72	0.00	DESENVOLVIMENTO DE SISTEMAS				E0230427\nE0230428\nE0230429	PROPOSTA ENVIADA 13/11V- COBREI A MINUTA 03/12	359.0001.0910/2024-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
767	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023151	T03	Ativo		2025-01-31 03:00:00	2026-01-30 03:00:00	\N	2309230.99	962601.63	0.00	1346629.36	0.00	NUVEM				E0230178	05.11.2025 - CLIENTE SOLICITOU ADITAMENTO DO CONTRATO	359.00000163/2023-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
768	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD020098	T06	Ativo		2025-02-01 03:00:00	2026-01-31 03:00:00	\N	226515.10	36403.82	0.00	190111.28	0.00	SAM ESTOQUE				E0200114	01/12 - Ser?? renovado, questionarei o cliente quando receberei a minuta.	359.00006939/2023-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
769	AMANDA ESTEVES	MUNICIPIO DE VALPARAISO	SERVI??OS PREFEITURAS	PD022513	T03	Ativo		2025-02-01 03:00:00	2026-01-31 03:00:00	\N	10491.12	6448.10	0.00	4043.02	0.00	PREFEITURA - SIM				E0220513	03/12 - Aguardando retorno da ficha e da minuta	359.00000739/2025-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
770	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD024398	T0	Ativo		2025-02-01 03:00:00	2026-01-31 03:00:00	\N	12233.04	8536.21	0.00	3696.83	0.00	SAM ESTOQUE e SAM PATRIMONIO				E0240552\nE0240553	03/12 - Aguardando recebimento da minuta	 359.00008298/2024-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
771	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE DE SAO PAULO	USP	PD023474	T01	Ativo		2025-02-01 03:00:00	2026-01-31 03:00:00	\N	6018034.56	1918887.17	0.00	4099147.39	0.00	NUVEM				E0230597	25/11/25 - Foi enviado a proposta para o cliente	359.0001.1167/2024-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
772	NADIA BERTUCCELLI	MUNICIPIO DE CACHOEIRA PAULISTA	SERVI??OS PREFEITURAS	PD024620	T01	Ativo		2025-02-02 03:00:00	2026-02-01 03:00:00	\N	20592.00	6406.40	0.00	14185.60	0.00	PREFEITURA - CADASTRO				E0240620		359.00003077/2024-58									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
773	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD025043	T0	Ativo		2025-02-04 03:00:00	2026-02-03 03:00:00	\N	13278393.85	9848142.05	0.00	3430251.80	0.00	HIPERAUTOMA????O				E0250053		359.00011103/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
774	DAIANE DA SILVA SOUZA	MUNICIPIO DE LEME	SERVI??OS PREFEITURAS	PD023611	T02	Ativo		2025-02-05 03:00:00	2026-02-04 03:00:00	\N	200160.00	69951.12	0.00	130208.88	0.00	PREFEITURA - CADASTRO				E0230611		359.00004364/2024-85									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
775	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	UNIVESP	PD024004	T01	Ativo		2025-02-05 03:00:00	2026-02-04 03:00:00	\N	3321.00	1642.86	0.00	1678.14	0.00	PROGRAMA SP SEM PAPEL				E0240004		359.00009689/2023-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
776	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE DESENVOLVIMENTO SOCIAL	SEDS	PD024381	T0	Ativo		2025-02-05 03:00:00	2026-02-06 03:00:00	\N	412752.00	302684.80	0.00	110067.20	0.00	OFFICE				E0240533		359.00007573/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
777	NADIA BERTUCCELLI	MUNICIPIO DE RIO CLARO	SERVI??OS PREFEITURAS	PD024724	T0	Ativo		2025-02-10 03:00:00	2026-02-09 03:00:00	\N	816000.00	591429.96	0.00	224570.04	0.00	PREFEITURA - CADASTRO				E0240724		359.00001808/2025-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
778	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PDC21047	T01	Ativo		2025-02-11 03:00:00	2026-02-10 03:00:00	\N	227952.00	34299.00	0.00	193653.00	0.00	DaaS				E0210062		359.0000.8039/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
779	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023004	T01	Ativo		2025-02-12 03:00:00	2026-02-11 03:00:00	\N	4260677.80	2522410.37	0.00	1738267.43	0.00	DESENVOLVIMENTO DE SISTEMAS				E0230004		359.00000778/2024-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
780	NADIA BERTUCCELLI	MUNICIPIO DE SERRA NEGRA	SERVI??OS PREFEITURAS	PD022809	T03	Ativo		2025-02-13 03:00:00	2026-02-12 03:00:00	\N	32817.60	11577.01	0.00	21240.59	0.00	PREFEITURA - SIM				E0220809		359.00004303/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
781	DAIANE DA SILVA SOUZA	MUNICIPIO DE REGISTRO	SERVI??OS PREFEITURAS	PD024646	T0	Ativo		2025-02-14 03:00:00	2026-02-13 03:00:00	\N	483120.00	116512.02	0.00	366607.98	0.00	SISTEMA DE CADASTRO DE MULTAS				E0240646		359.00008763/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
782	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PDC21388	T02	Ativo		2025-02-16 03:00:00	2026-02-15 03:00:00	\N	15645.53	2457.99	0.00	13187.54	0.00	PROGRAMA SP SEM PAPEL				EC210503		359.00002232/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
783	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PIEDADE	SERVI??OS PREFEITURAS	PD021744	T03	Ativo		2025-02-17 03:00:00	2026-02-16 03:00:00	\N	170961.60	131560.05	0.00	39401.55	0.00	PREFEITURA - CADASTRO				E0210744		359.00000992/2025-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
784	LUCIANO PACHECO	CASA MILITAR DO GABINETE DO GOVERNADOR	CASA MILITAR	PD024316	T0	Ativo		2025-01-23 03:00:00	2026-01-22 03:00:00	\N	64011.50	61878.98	0.00	2132.52	0.00	SAM ESTOQUE				E0240456 E0240457	05/11/25 - Proposta de PRORROGA????O  encaminhada ao cliente	359.00006334/2024-11									2025-12-09 17:19:01.908	2026-01-06 17:37:32.925
785	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PARA O REMEDIO POPULAR FURP	FURP	PD024406	T0	Ativo		2025-02-10 03:00:00	2026-02-09 03:00:00	\N	243298.20	128613.60	0.00	114684.60	0.00	OFFICE				E0240563	28/11 - Elabora????o do kit proposta	359.00008488/2024-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
787	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD023038	T0	Ativo		2023-01-30 03:00:00	2026-01-29 03:00:00	\N	1073623.32	1016557.23	0.00	57066.09	0.00	PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0230045	03/12 -  Aguardando o envio da minuta da renova????o										2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
788	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD025007	T0	Ativo		2025-02-21 03:00:00	2026-02-20 03:00:00	\N	243349.56	182512.17	0.00	60837.39	0.00	OFFICE				E0250009		359.00010017/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
789	DAIANE DA SILVA SOUZA	MUNICIPIO DE RIO DAS PEDRAS	SERVI??OS PREFEITURAS	PD021694	T04	Ativo		2025-02-22 03:00:00	2026-02-21 03:00:00	\N	40932.00	5457.60	0.00	35474.40	0.00	PREFEITURA - CADASTRO				E0210694		359.00004514/2024-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
790	NADIA BERTUCCELLI	MUNICIPIO DE ILHABELA	SERVI??OS PREFEITURAS	PD022590	T02	Ativo		2025-02-22 03:00:00	2026-02-21 03:00:00	\N	276288.00	115446.22	0.00	160841.78	0.00	PREFEITURA - SIM				E0220590		359.00003923/2024-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
791	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD025038		Ativo		2025-06-24 03:00:00	2026-02-23 03:00:00	\N	8904092.26	3331261.66	0.00	5572830.60	0.00	DESENVOLVIMENTO DE SISTEMAS				E0250047		359.00003569/2025-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
792	DAIANE DA SILVA SOUZA	MUNICIPIO DE TABOAO DA SERRA	SERVI??OS PREFEITURAS	PD021693	T04	Ativo		2025-02-26 03:00:00	2026-02-25 03:00:00	\N	2909400.00	502120.29	0.00	2407279.71	0.00	PREFEITURA - CADASTRO				E0210693		359.00001806/2025-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
793	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BOTUCATU	SERVI??OS PREFEITURAS	PD025099	T0	Ativo		2025-02-26 03:00:00	2026-02-25 03:00:00	\N	176112.00	36827.46	0.00	139284.54	0.00	PREFEITURA - CADASTRO				E0250114		359.00010348/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
795	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD025061	T0	Ativo		2025-02-27 03:00:00	2026-02-26 03:00:00	\N	209765.50	14475.40	0.00	195290.10	0.00	MAINFRAME IBM				E0250074		359.00011527/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
796	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DO VALE DO PARAIBA E LITORAL NORTE - AGEMVALE	AGEMVALE	PD024013	T01	Ativo		2025-02-28 03:00:00	2026-02-27 03:00:00	\N	3032.16	498.24	0.00	2533.92	0.00	FOLHA DE PAGAMENTO				E0240017		359.00001886/2024-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
797	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD024309	T0	Ativo		2025-02-28 03:00:00	2026-02-27 03:00:00	\N	39930.23	12174.48	0.00	27755.75	0.00	FOLHA DE PAGAMENTO				E0240448		359.00005879/2024-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
798	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD020095	T04	Ativo		2025-03-01 03:00:00	2026-02-28 03:00:00	\N	18395.08	11979.54	0.00	6415.54	0.00	M??DULO ESTOQUE - SAM				E0200110		359.0000.0126/2025-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
799	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD021004	T04	Ativo		2025-03-01 03:00:00	2026-02-28 03:00:00	\N	30962.28	7142.32	0.00	23819.96	0.00	FOLHA DE PAGAMENTO				E0210005		359.00003743/2025-39						PD025204			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
800	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD023146	T0	Ativo		2023-09-01 03:00:00	2026-02-28 03:00:00	\N	5843306.70	3865519.09	0.00	1977787.61	0.00	SERVI??OS DE OPERA????O E SUPORTE TECNICO DA AC SAT SEFAZ SP E CERTIFICADO DIGITAL				E0230171		359.00001539/2023-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
801	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CANANEIA	SERVI??OS PREFEITURAS	PD022810	T03	Ativo		2025-03-02 03:00:00	2026-03-01 03:00:00	\N	23004.00	5627.10	0.00	17376.90	0.00	PREFEITURA - SIM				E0220810		359.00010941/2025-59									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
802	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO LOURENCO DA SERRA	SERVI??OS PREFEITURAS	PD021699	T04	Ativo		2025-03-03 03:00:00	2026-03-02 03:00:00	\N	9340.80	6271.68	0.00	3069.12	0.00	PREFEITURA - CADASTRO				E0210699		359.00001048/2025-32									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
803	NADIA BERTUCCELLI	MUNICIPIO DE LIMEIRA	SERVI??OS PREFEITURAS	PD022813	T04	Ativo		2025-03-03 03:00:00	2026-03-02 03:00:00	\N	1484400.00	551459.64	0.00	932940.36	0.00	PREFEITURA - CADASTRO				E0220813		359.00003925/2024-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
804	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T05	Ativo		2025-09-04 03:00:00	2026-03-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	AMBIENTE DE HOSPEDAGEM  DOS SISTEMAS DAEE				E0230285											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
805	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T05	Ativo		2025-09-04 03:00:00	2026-03-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	FOLHA PAGAMENTO				E0230286											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
806	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T05	Ativo		2025-09-04 03:00:00	2026-03-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	MANUTEN????O DOS SISTEMAS GERENCIA DOS RECURSOS HIDRICOS				E0230284											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
807	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T05	Ativo		2025-09-04 03:00:00	2026-03-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	SAM PATRIMONIO				E0230287											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
808	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T05	Ativo		2025-09-04 03:00:00	2026-03-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	SERVI??OS DE GEST??O CENTRALIZADA PARA INFRAESTRUTURA DE TIC				E0230288											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
809	LUIS CLAUDINEI DA SILVA	PREF. MUN. - SAO VICENTE	SERVI??OS PREFEITURAS	PD025103	T0	Ativo		2025-03-07 03:00:00	2026-03-06 03:00:00	\N	2749200.00	1148473.00	0.00	1600727.00	0.00	PREFEITURA - CADASTRO				E0250116		359.00001268/2025-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
810	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022017	T01	Ativo		2024-03-08 03:00:00	2026-03-07 03:00:00	\N	1427003.03	1414816.32	0.00	12186.71	0.00	SISTEMA eSISLA-WEB   DPME				E0220024											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
811	NADIA BERTUCCELLI	MUNICIPIO DE MONTE ALTO	SERVI??OS PREFEITURAS	PD025064	T0	Ativo		2025-03-10 03:00:00	2026-03-09 03:00:00	\N	64440.00	21512.22	0.00	42927.78	0.00	PREFEITURA - CADASTRO				E0250078		359.00011512/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
812	DAIANE DA SILVA SOUZA	MUNICIPIO DE AREALVA	SERVI??OS PREFEITURAS	PD022511	T03	Ativo		2025-03-12 03:00:00	2026-03-11 03:00:00	\N	6854.40	4236.40	0.00	2618.00	0.00	PREFEITURA - CADASTRO				E0220511		359.00001773/2025-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
814	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IPAUSSU	SERVI??OS PREFEITURAS	PD025141	T0	Ativo		2025-03-12 03:00:00	2026-03-11 03:00:00	\N	644.40	644.40	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0250163		359.00011512/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
815	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE IPAUSSU	SERVI??OS PREFEITURAS	PD025141	TI-2025	Ativo		2025-10-01 03:00:00	2026-03-11 03:00:00	\N	644.40	644.40	0.00	0.00	0.00	PREFEITURA CADASTRO				E0250163											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
816	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023270	T01	Ativo		2024-12-13 03:00:00	2026-03-12 03:00:00	\N	239685.25	170039.92	0.00	69645.33	0.00	CERTIFICADO DIGITAL				E0230309		359.00001577/2023-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
817	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD025039	T0	Ativo		2025-03-14 03:00:00	2026-03-13 03:00:00	\N	189402.07	135753.91	0.00	53648.16	0.00	PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0250048		359.00011056/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
818	NADIA BERTUCCELLI	MUNICIPIO DE JARINU	SERVI??OS PREFEITURAS	PD025073	T0	Ativo		2025-03-14 03:00:00	2026-03-13 03:00:00	\N	365040.00	51552.00	0.00	313488.00	0.00	PREFEITURA - CADASTRO				E0250087		359.00001720/2025-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
819	DAIANE DA SILVA SOUZA	MUNICIPIO DE PATROCINIO PAULISTA	SERVI??OS PREFEITURAS	PD025120	T0	Ativo		2025-03-14 03:00:00	2026-03-13 03:00:00	\N	7732.80	4704.12	0.00	3028.68	0.00	PREFEITURA - CADASTRO				E0250139		359.00000922/2025-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
820	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE DE SAO PAULO	USP	PD024235	T0	Ativo		2025-03-14 03:00:00	2026-03-13 03:00:00	\N	23377.39	23377.39	0.00	0.00	0.00	ASSINA. SP BOX				E0240356		359.0000.6858/2024-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
821	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MAIRIPORA	SERVI??OS PREFEITURAS	PD022510	T03	Ativo		2025-03-15 03:00:00	2026-03-14 03:00:00	\N	723120.00	211008.32	0.00	512111.68	0.00	PREFEITURA - CADASTRO				E0220510		359.00004361/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
822	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD023207	T01	Ativo		2024-12-17 03:00:00	2026-03-16 03:00:00	\N	346542.04	239848.53	0.00	106693.51	0.00	SAM PATRIM??NIO				E0230237		359.00005951/2023-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
823	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD024488	T0	Ativo		2025-03-17 03:00:00	2026-03-16 03:00:00	\N	11251.20	7500.80	0.00	3750.40	0.00	SAM ESTOQUE				E0241065		359.00011414/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
826	NADIA BERTUCCELLI	MUNICIPIO DE IGARACU DO TIETE	SERVI??OS PREFEITURAS	PD023605	T02	Ativo		2025-03-23 03:00:00	2026-03-22 03:00:00	\N	22003.20	12136.14	0.00	9867.06	0.00	PREFEITURA - CADASTRO				E0230605		359.00002007/2025-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
827	DAIANE DA SILVA SOUZA	MUNICIPIO DE SALESOPOLIS	SERVI??OS PREFEITURAS	PD023636	T02	Ativo		2025-03-23 03:00:00	2026-03-22 03:00:00	\N	55382.40	19830.11	0.00	35552.29	0.00	PREFEITURA - SIM				E0230636		359.00002246/2025-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
828	NADIA BERTUCCELLI	MUNICIPIO DE BATATAIS	SERVI??OS PREFEITURAS	PD021706	T04	Ativo		2025-03-24 03:00:00	2026-03-23 03:00:00	\N	40032.00	27032.72	0.00	12999.28	0.00	PREFEITURA - CADASTRO				E0210706		359.00003444/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
829	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE LUCELIA	SERVI??OS PREFEITURAS	PD025062	T0	Ativo		2025-03-24 03:00:00	2026-03-23 03:00:00	\N	12888.00	5155.20	0.00	7732.80	0.00	PREFEITURA - CADASTRO				E0250076		359.00011381/2024-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
830	DAIANE DA SILVA SOUZA	MUNICIPIO DE JUNQUEIROPOLIS	SERVI??OS PREFEITURAS	PD025124	T0	Ativo		2025-03-24 03:00:00	2026-03-23 03:00:00	\N	17089.92	10708.23	0.00	6381.69	0.00	PREFEITURA - SIM				E0250144		359.00000929/2025-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
831	NADIA BERTUCCELLI	MUNICIPIO DE GUARUJA	SERVI??OS PREFEITURAS	PD251036	T0	Ativo		2025-03-25 03:00:00	2026-03-24 03:00:00	\N	1460389.32	718388.65	0.00	742000.67	0.00	PREFEITURA - CADASTRO				E0251046		359.00002633/2025-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
832	DAIANE DA SILVA SOUZA	MUNICIPIO DE MOCOCA	SERVI??OS PREFEITURAS	PD025145	T0	Ativo		2025-03-26 03:00:00	2026-03-25 03:00:00	\N	77328.00	16303.32	0.00	61024.68	0.00	PREFEITURA - CADASTRO				E0250167		359.00006040/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
833	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD025041	T0	Ativo		2025-03-27 03:00:00	2026-03-26 03:00:00	\N	9880335.15	5862093.64	0.00	4018241.51	0.00	NUVEM				E0250050		359.00011210/2024-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
834	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE RIFAINA	SERVI??OS PREFEITURAS	PD022804	T03	Ativo		2025-03-30 03:00:00	2026-03-29 03:00:00	\N	17136.00	5683.44	0.00	11452.56	0.00	PREFEITURA - CADASTRO				E0220804		359.00005393/2024-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
835	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD022478	T0	Ativo		2023-03-31 03:00:00	2026-03-30 03:00:00	\N	7268.20	7268.20	0.00	0.00	0.00	CERTIFICADO DIGITAL				E0220925											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
836	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD020345	T03	Ativo		2025-01-01 03:00:00	2026-03-31 03:00:00	\N	569338.13	308417.03	0.00	260921.10	0.00	MANUTEN????O DO SISTEMA				E0200446		359.00002590/2023-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
837	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023050	T02	Ativo		2025-04-01 03:00:00	2026-03-31 03:00:00	\N	6396.00	3478.17	0.00	2917.83	0.00	PROGRAMA SP SEM PAPEL				E0230059		359.00003830/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
838	FRANCINE TANIGUCHI FALLEIROS DIAS	SUPERINTENDENCIA DA POLICIA TECNICO-CIENTIFICA	SPTC	PD024385	T0	Ativo		2025-04-01 03:00:00	2026-03-31 03:00:00	\N	1646720.40	960586.90	0.00	686133.50	0.00	OFFICE				E0240537		359.00007463/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
839	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD025127	T0	Ativo		2025-04-01 03:00:00	2026-03-31 03:00:00	\N	885857.73	225394.16	0.00	660463.57	0.00	INFRAESTRUTURA				E0250147		359.00001040/2025-76									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
841	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PDC25002	T0	Ativo		2025-03-22 03:00:00	2026-03-20 03:00:00	\N	14246.40	9497.60	0.00	4748.80	0.00	OFFICE				EC250003	28/11 - Em negocia????o com o cliente	359.00009996/2024-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
842	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD023337	T01	Ativo		2024-12-26 03:00:00	2026-03-25 03:00:00	\N	1141706.32	374550.33	0.00	767155.99	0.00	OUTSOURCING				E0230409	28/11 - Aguardando retorno do cliente	359.00006431/2023-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
843	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD024204	T0	Ativo		2025-04-03 03:00:00	2026-04-02 03:00:00	\N	239829.47	144950.05	0.00	94879.42	0.00	INFRAESTRUTURA				E0240319		359.00007023/2024-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
846	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD025002	T0	Ativo		2025-03-21 03:00:00	2025-03-21 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVI??O				E0250003	Assinado	359.00009996/2024-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
847	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD019165	T02	Ativo		2023-04-01 03:00:00	2025-01-01 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SERVICOS TECNICOS ESPECIALIZADOS ON SITE				EC190219	Assinado  (Renovado no contrato PD024476) 	359.00009255/2024-54						PD024476			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
848	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022346	T00	Ativo		2023-01-02 03:00:00	2025-01-01 03:00:00	\N	1215690.57	1050121.93	0.00	165568.64	0.00	MANUTEN????O  DOS SISTEMAS -RH FOLHA VIDA FUNCIONAL				E0220451	Assinado	359.00008351/2024-85									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
849	ANA LIGIA SAPIENZA COLOMBO	TRIBUNAL DE JUSTICA MILITAR DO ESTADO DE SAO PAULO	TJM	PD023406	T00	Ativo		2024-01-12 03:00:00	2025-01-11 03:00:00	\N	6162.82	4955.27	0.00	1207.55	0.00	SAM ESTOQUE  E  PATRIMONIO				E0230500\nE0230501	Assinado	359.00000471/2024-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
850	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024006	T01	Ativo		2024-07-18 03:00:00	2025-01-17 03:00:00	\N	6556053.48	2764690.14	0.00	3791363.34	0.00	OUTSOURCING				E0240006	Assinado	359.00005428/2024-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
851	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024052	T01	Ativo		2024-07-18 03:00:00	2025-01-17 03:00:00	\N	15184451.76	7028745.22	0.00	8155706.54	0.00	Sustenta????o de sistemas				E0240074\nE0240075	Assinado	359.00005451/2024-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
852	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD021235	T01	Ativo		2024-10-27 03:00:00	2025-01-26 03:00:00	\N	489200.40	87748.97	0.00	401451.43	0.00	DaaS-DESKTOP B??SICO e  PLUS				E0210309	Assinado	359.00010119/2024-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
853	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO JOSE DO RIO PRETO	SERVI??OS PREFEITURAS	PD021702	T03	Ativo		2024-04-02 03:00:00	2026-04-01 03:00:00	\N	4410819.90	2477641.63	0.00	1933178.27	0.00	PREFEITURA - CADASTRO				E0210702											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
854	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD024083	T01	Ativo		2025-04-02 03:00:00	2026-04-01 03:00:00	\N	2411864.16	930519.13	0.00	1481345.03	0.00	FOLHA DE PAGAMENTO				E0240128		359.0000.1357/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
845	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MOGI-GUACU	PREFEITURA	PD251031	T01	Ativo	\N	2025-04-14 09:00:00	2026-04-13 09:00:00	\N	1675189.32	598995.90	0.00	1076193.42	0.00	OFFICE	\N	\N	\N	E0251025	\N	359.00002059/2025-30	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
840	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MOGI DAS CRUZES	PREFEITURA	PD025075	T0	Ativo	\N	2025-03-21 09:00:00	2026-03-20 09:00:00	\N	2086089.00	1094952.00	0.00	991137.00	0.00	OFFICE	\N	\N	\N	E0250089	\N	359.00000239/2025-87	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
855	PAULO MARCELLO DA SILVA FERREIRA	CONSELHO DE ARQUITETURA E URBANISMO DE SAO PAULO (CAU-SP)	CAU - SP	PD025030	T0	Ativo		2025-04-02 03:00:00	2026-04-01 03:00:00	\N	1793.64	999.94	0.00	793.70	0.00	CERTIFICADO DIGITAL				E0250036		359.00011231/2024-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
856	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD025175	T0	Ativo		2025-04-03 03:00:00	2026-04-02 03:00:00	\N	3294845.04	998368.44	0.00	2296476.60	0.00	NUVEM				E0250203		359.00002545/2025-58									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
857	JUNEIDY SOLANGE BETECA JONY	COMPANHIA PAULISTA DE SECURITIZACAO	CPS	PD024136	T01	Ativo		2025-04-05 03:00:00	2026-04-04 03:00:00	\N	18.02	10.57	0.00	7.45	0.00	PROGRAMA SP SEM PAPEL				E0240232		359.00003057/2024-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
858	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE RPUSP	HCRPUSP	PD024089	T01	Ativo		2025-04-12 03:00:00	2026-04-11 03:00:00	\N	4828.27	2592.66	0.00	2235.61	0.00	PROGRAMA SP SEM PAPEL				E0240136		359.0000.8729/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
859	MARTA MARIA NOVAES DE ALC??NTARA	CIA DO METROPOLITANO DE SAO PAULO	METR??	PD025058	T0	Ativo		2025-04-14 03:00:00	2026-04-13 03:00:00	\N	4986.24	2908.64	0.00	2077.60	0.00	OFFICE				E0250071		359.00001651/2025-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
860	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MORRO AGUDO	SERVI??OS PREFEITURAS	PD025152	T0	Ativo		2025-04-14 03:00:00	2026-04-13 03:00:00	\N	24487.20	12769.86	0.00	11717.34	0.00	PREFEITURA - CADASTRO				E0250174		359.00001944/2025-00									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
861	DAIANE DA SILVA SOUZA	MUNICIPIO DE EMBU-GUACU	SERVI??OS PREFEITURAS	PD251016	T0	Ativo		2025-04-14 03:00:00	2026-04-13 03:00:00	\N	246960.00	109872.78	0.00	137087.22	0.00	PREFEITURA - CADASTRO				E0251019		359.00002427/2025-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
862	NADIA BERTUCCELLI	MUNICIPIO DE PINDAMONHANGABA	SERVI??OS PREFEITURAS	PD251031	T0	Ativo		2025-04-14 03:00:00	2026-04-13 03:00:00	\N	1675189.32	598995.90	0.00	1076193.42	0.00	PREFEITURA - CADASTRO				E0251038		359.00002035/2025-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
863	DAIANE DA SILVA SOUZA	MUNICIPIO DE SOCORRO	SERVI??OS PREFEITURAS	PD251028	T0	Ativo		2025-04-15 03:00:00	2026-04-14 03:00:00	\N	106812.00	30885.57	0.00	75926.43	0.00	PREFEITURA - SIM				E0251035		359.00002018/2025-43									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
864	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD024360	T0	Ativo		2025-04-17 03:00:00	2026-04-16 03:00:00	\N	11530.80	6213.96	0.00	5316.84	0.00	SAM ESTOQUE e SAM PATRIMONIO				E0240507		359.00006901/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
865	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023472	T02	Ativo		2025-04-18 03:00:00	2026-04-17 03:00:00	\N	185368.32	88015.93	0.00	97352.39	0.00	NUVEM				E0230595		359.00009146/2023-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
866	MARIA REGINA FUNICELLO	BANCO  DAYCOVAL S.A.	DAYCOVAL	PD025107	T0	Ativo		2025-04-24 03:00:00	2026-04-23 03:00:00	\N	71030.64	23676.88	0.00	47353.76	0.00	HOSPEDAGEM				E0250123		359.00000733/2025-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
867	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD024093	T01	Ativo		2025-04-25 03:00:00	2026-04-24 03:00:00	\N	348900.33	178780.65	0.00	170119.68	0.00	NUVEM				E0240142		359.00003454/2024-59									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
868	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023039	T02	Ativo		2025-04-26 03:00:00	2026-04-25 03:00:00	\N	102660.00	51064.19	0.00	51595.81	0.00	GERENCIAMENTO ANTIVIRUS				E0230046		359.00004152/2024-06									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
869	KARINA FREIRE GRANDA SALLES	ASSEMBLEIA LEGISLATIVA DO ESTADO DE SAO PAULO	ALESP	PD024477	T0	Ativo		2025-04-29 03:00:00	2026-04-28 03:00:00	\N	4933218.16	1564180.34	0.00	3369037.82	0.00	Prodesp Shield com Gest??o de Opera????o Bronze				E0241053		359.00009284/2024-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
870	DAIANE DA SILVA SOUZA	MUNICIPIO DE JUQUITIBA	SERVI??OS PREFEITURAS	PD251081	T0	Ativo		2025-04-29 03:00:00	2026-04-28 03:00:00	\N	25776.00	8377.20	0.00	17398.80	0.00	PREFEITURA - CADASTRO				E0251165		359.00003504/2025-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
871	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD022463	T02	Ativo		2025-04-30 03:00:00	2026-04-29 03:00:00	\N	2123899.44	543750.68	0.00	1580148.76	0.00	NUVEM				E0220907		359.00000254/2023-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
872	NADIA BERTUCCELLI	MUNICIPIO DE TAQUARITINGA	SERVI??OS PREFEITURAS	PD025112	T0	Ativo		2025-04-30 03:00:00	2026-04-29 03:00:00	\N	57996.00	6766.20	0.00	51229.80	0.00	PREFEITURA - CADASTRO				E0250142		359.00002514/2025-05									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
873	DAIANE DA SILVA SOUZA	MUNICIPIO DE TATUI	SERVI??OS PREFEITURAS	PD251020	T0	Ativo		2025-04-30 03:00:00	2026-04-29 03:00:00	\N	822096.00	155896.14	0.00	666199.86	0.00	PREFEITURA - SIM				E0251026		359.00002427/2025-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
874	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD020121	T04	Ativo		2025-05-01 03:00:00	2026-04-30 03:00:00	\N	338806.53	62475.12	0.00	276331.41	0.00	NUVEM				E0200143		359.00002466/2023-85									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
875	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD022408	T03	Ativo		2025-05-01 03:00:00	2026-04-30 03:00:00	\N	6901715.66	3211840.41	0.00	3689875.25	0.00	NUVEM				E0220489		359.00001019/2024-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
876	NADIA BERTUCCELLI	MUNICIPIO DE TABAPUA	SERVI??OS PREFEITURAS	PD251062	T0	Ativo		2025-05-05 03:00:00	2026-05-04 03:00:00	\N	21362.40	4491.09	0.00	16871.31	0.00	SISTEMA INTEGRADO DE MULTAS - SIM				E0251141		359.00003011/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
877	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD022485	T02	Ativo		2025-05-09 03:00:00	2026-05-08 03:00:00	\N	483071.41	87856.64	0.00	395214.77	0.00	SISTEMA DE CADASTRO DE MULTAS				E0220936		359.00000026/2023-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
878	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD021252	T03	Ativo		2025-05-11 03:00:00	2026-05-10 03:00:00	\N	1139562.80	358137.20	0.00	781425.60	0.00	CONSULTORIA ESPECIALIZADA				E0210327		359.00005835/2025-53\n359.00001603/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
879	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO CONSERV PROD FLORESTAL EST SP	FUND. FLORESTAL	PD024464	T0	Ativo		2025-05-14 03:00:00	2026-05-13 03:00:00	\N	12723.96	5301.65	0.00	7422.31	0.00	SAM ESTOQUE				E0241035		359.00011506/2024-61									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
880	DAIANE DA SILVA SOUZA	MUNICIPIO DE PIRAJU	SERVI??OS PREFEITURAS	PD251026	T0	Ativo		2025-05-14 03:00:00	2026-05-13 03:00:00	\N	74768.40	3333.15	0.00	71435.25	0.00	PREFEITURA - SIM				E0251032		359.00003024/2024-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
881	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD023077	T02	Ativo		2025-05-17 03:00:00	2026-05-16 03:00:00	\N	9495.25	1683.65	0.00	7811.60	0.00	FOLHA DE PAGAMENTO				E0230089		359.0000.0808/2023-22									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
882	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD022098	T02	Ativo		2025-02-19 03:00:00	2026-05-18 03:00:00	\N	3839564.25	1462321.19	0.00	2377243.06	0.00	PROCESSAMENTO IBM				E0220131		359.00003425/2023-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
883	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD022144	T03	Ativo		2025-05-19 03:00:00	2026-05-18 03:00:00	\N	474420.24	209655.56	0.00	264764.68	0.00	SISTEMA GABINETE VIRTUAL - ARQUIVAMENTO				E0220185		359.00000230/2023-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
884	NADIA BERTUCCELLI	MUNICIPIO DE GUAPIARA	SERVI??OS PREFEITURAS	PD251118	T0	Ativo		2025-05-20 03:00:00	2026-05-19 03:00:00	\N	9613.08	3484.62	0.00	6128.46	0.00	PREFEITURA - SIM				E0251213		359.00003740/2025-03									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
885	NADIA BERTUCCELLI	MUNICIPIO DE ITAI	SERVI??OS PREFEITURAS	PD025146	T0	Ativo		2025-01-07 03:00:00	2026-05-19 03:00:00	\N	5874.78	2727.96	0.00	3146.82	0.00	PREFEITURA - CADASTRO				EA250168		359.00001806/2025-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
886	DAIANE DA SILVA SOUZA	MUNICIPIO DE MARTINOPOLIS	SERVI??OS PREFEITURAS	PD251019	T0	Ativo		2025-05-20 03:00:00	2026-05-19 03:00:00	\N	64087.20	3828.51	0.00	60258.69	0.00	PREFEITURA - SIM				E0251024		359.00002028/2025-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
887	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD024112	T01	Ativo		2025-05-14 03:00:00	2026-05-13 03:00:00	\N	154284.48	70705.81	0.00	83578.67	0.00	SERVI??O DE GEST??O CENTRALIZADA  - OUTSOURCING				E0240165		359.00003903/2024-69									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
890	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PDC24016	T01	Ativo		2025-04-17 03:00:00	2026-04-16 03:00:00	\N	4133.07	1879.44	0.00	2253.63	0.00	PROGRAMA SP SEM PAPEL				EC240021		359.00002142/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
891	JUNEIDY SOLANGE BETECA JONY	SECRETARIA MUNICIPAL DA PESSOA COM DEFICIENCIA	SMPED	PD022035	T01	Ativo		2024-02-12 03:00:00	2025-02-11 03:00:00	\N	6016.51	6016.51	0.00	0.00	0.00	PACOTE PORTAL DE ASSINATURA DIGITAL assina.sp F??CIL e PACOTE DE CERTIFICADO DE ATRIBUTO				E0220046	Assinado	359.00000673/2025-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
892	ANA LIGIA SAPIENZA COLOMBO	SECRETARIA DA JUSTICA E DA DEFESA DA CIDADANIA	SJC	PD251037 	T00	Ativo		2025-07-24 03:00:00	2026-07-23 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE				E0251048		359.00002652/2025-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
893	ANA LIGIA SAPIENZA COLOMBO	SECRETARIA DA JUSTICA E DA DEFESA DA CIDADANIA	SJC	PD024256	T0	Ativo		2025-03-07 03:00:00	2026-03-06 03:00:00	\N	25732.56	15010.66	0.00	10721.90	0.00	SAM ESTOQUE e SAM PATRIMONIO				E0240385		359.00008369/2024-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
894	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD023352	T00	Ativo		2024-01-27 03:00:00	2025-01-28 03:00:00	\N	3996527.84	2982044.12	0.00	1014483.72	0.00	DESENVOLVIMENTO. SERVI??O E SUPORTE  DOS  SISTEMAS SIGH - SUSTENTA????O DO SISTEMA INTEGRADO DE GEST??O. IMPRESS??O E PAAS MIDDLEWARE COM SERVI??OS DE GEST??O				E0230427\nE0230428\nE0230429	Assinado	359.00010910/2024-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
895	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023151	T03	Ativo		2024-09-30 03:00:00	2025-01-29 03:00:00	\N	2309230.99	962601.63	0.00	1346629.36	0.00	NUVEM PUBLICA. INFRAESTRUTURA E CERTIFICADO SSL STANDARD				E0230178	Assinado	359.00000163/2023-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
896	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD020098	T06	Ativo		2024-02-01 03:00:00	2025-01-31 03:00:00	\N	226515.10	36403.82	0.00	190111.28	0.00	SAM - MODELO ESTOQUE				E0200114	Assinado	359.00006939/2023-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
897	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE DE SAO PAULO	USP	PD023474	T01	Ativo		2024-02-01 03:00:00	2025-01-31 03:00:00	\N	6018034.56	1918887.17	0.00	4099147.39	0.00	NUVEM PUBLICA				E0230597	Assinado	359.00011167/2024-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
898	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	UNIVESP	PD024004	T01	Ativo		2024-02-05 03:00:00	2025-02-04 03:00:00	\N	3321.00	1642.86	0.00	1678.14	0.00	PROGRAMA SP SEM PAPEL				E0240004	Assinado	359.00009689/2023-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
899	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024063	T01	Ativo		2024-08-08 03:00:00	2025-02-07 03:00:00	\N	1036311.02	512609.70	0.00	523701.32	0.00	FOLHA DE PAGAMENTO				E0240372\nE0240241\nE0240093	Assinado	359.00005429/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
900	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO - IPT	IPT	PD022465	T01	Ativo		2023-02-15 03:00:00	2025-02-14 03:00:00	\N	12344.28	1271.21	0.00	11073.07	0.00	PROGRAMA SP SEM PAPEL				E0220909	Assinado	359.00010386/2024-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
901	JUNEIDY SOLANGE BETECA JONY	INCLOUD TECNOLOGIA E SERVICOS LTDA	DOCKTEKA	PD024102	T0	Ativo		2024-01-29 03:00:00	2025-01-28 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	CARIMBO DO TEMPO				E0240152	Contrato renovado no PD025116	359.00000653/2024-13						PD025116			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
902	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PARA O REMEDIO POPULAR FURP	FURP	PD024019	T00	Ativo		2024-03-08 03:00:00	2025-03-07 03:00:00	\N	6661.44	1028.40	0.00	5633.04	0.00	PROGRAMA SP SEM PAPEL				E0240024	Assinado	359.00010917/2024-39									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
903	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD020095	T03	Ativo		2024-03-01 03:00:00	2025-02-28 03:00:00	\N	18395.08	11979.54	0.00	6415.54	0.00	M??DULO ESTOQUE - SAM				E0200110	Assinado	359.00000126/2025-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
904	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE MARILIA - HCFAMEMA	HCFAMEMA	PD021004	T03	Ativo		2024-03-01 03:00:00	2025-02-28 03:00:00	\N	30962.28	7142.32	0.00	23819.96	0.00	PROCESSAMENTO DE FOLHA MENSAL - N??CLEO				E0210005	Contrato Assinado	359.00000130/2025-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
905	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE MEIO AMBIENTE INFRAESTRUTURA E LOGISTICA	SEMIL	PD022047	TI-2024	Ativo		2023-04-01 03:00:00	2025-02-28 03:00:00	\N	3794.50	3794.47	0.00	0.03	0.00	PROGRAMA SP SEM PAPEL				E0220063	10/03/2025 - Alinhamento com a Selma para saber com quem ficara esta demanada. \n\n26/03/25 - Publica????o do DOE falando que n??o vai mais se renovado.	359.00002441/2025-43									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
907	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T01	Ativo		2024-09-04 03:00:00	2025-03-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	AMBIENTE DE HOSPEDAGEM  DOS SISTEMAS DAEE				E0230285	Assinado	359.00002448/2023-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
908	NADIA BERTUCCELLI	MUNICIPIO DE JARINU	SERVI??OS PREFEITURAS	PD025073	T0	Ativo		2024-09-11 03:00:00	2025-03-13 03:00:00	\N	365040.00	51552.00	0.00	313488.00	0.00	PREFEITURA - CADASTRO				E0250087	Assinado  	359.00001720/2025-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
909	DAIANE DA SILVA SOUZA	MUNICIPIO DE SOCORRO	SERVI??OS PREFEITURAS	PD251028	T0	Ativo		2024-03-17 03:00:00	2025-03-16 03:00:00	\N	106812.00	30885.57	0.00	75926.43	0.00	PREFEITURA - SIM				E0251035	Assinado  	359.00002018/2025-43									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
910	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD022033	T01	Ativo		2023-12-19 03:00:00	2025-03-18 03:00:00	\N	100491512.80	60460154.48	0.00	40031358.32	0.00	NUVEM PUBLICA				E0220044	Assinado	359.00004861/2023-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
911	JUNEIDY SOLANGE BETECA JONY	FUNDACAO CARLOS ALBERTO VANZOLINI	FCAV	PD022071	T02	Ativo		2024-04-01 03:00:00	2025-03-31 03:00:00	\N	114946.60	56364.00	0.00	58582.60	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES				E0220095	Assinado	359.00001322/2023-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
889	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE GUARULHOS	PREFEITURA	PD251059	T0	Ativo	\N	2025-05-08 09:00:00	2026-05-07 09:00:00	\N	256932.00	123469.45	0.00	133462.55	0.00	OFFICE	\N	\N	\N	E0251138	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
888	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE FRANCA	PREFEITURA	PD023205	T03	Ativo	\N	2025-05-02 09:00:00	2026-05-01 09:00:00	\N	1382040.00	691020.00	0.00	691020.00	0.00	OFFICE	\N	\N	\N	E0230235	\N	359.00000009/2023-56	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
912	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD023147	T01	Ativo		2024-09-25 03:00:00	2025-03-24 03:00:00	\N	2691989.50	701873.59	0.00	1990115.91	0.00	DESENVOLVIMENTO/IMPLANTA????O, SUSTENTA????O DO SISTEMA CIPTEA				E0230172	Assinado	359.00006444/2023-94									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
913	PAULO MARCELLO DA SILVA FERREIRA	CONSELHO DE ARQUITETURA E URBANISMO DE SAO PAULO (CAU-SP)	CAU - SP	PD025030	T0	Ativo		2024-03-20 03:00:00	2025-03-20 03:00:00	\N	1793.64	999.94	0.00	793.70	0.00	CERTIFICADO DIGITAL e-CPF  -  e-CNPJ				E0250078	Assinado	359.00011231/2024-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
914	MARTA MARIA NOVAES DE ALC??NTARA	CIA DO METROPOLITANO DE SAO PAULO	METR??	PD023020	T0	Ativo		2023-03-23 03:00:00	2025-03-22 03:00:00	\N	53419.98	453.14	0.00	52966.84	0.00	PROGRAMA SP SEM PAPEL				E0230025	Assinado	359.00009914/2024-52									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
915	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ARACOIABA DA SERRA	SERVI??OS PREFEITURAS	PD022580	T02	Ativo		2024-03-24 03:00:00	2025-03-23 03:00:00	\N	124610.40	37645.87	0.00	86964.53	0.00	PREFEITURA - SIM				E0220580	Assinado  	359.00002531/2025-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
916	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DE RPUSP	HCRPUSP	PD024089	T0	Ativo		2024-03-25 03:00:00	2025-03-24 03:00:00	\N	4828.27	2592.66	0.00	2235.61	0.00	PROGRAMA SP SEM PAPEL				E0240136	Assinado	359.00008729/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
917	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD022496	T0	Ativo		2023-03-29 03:00:00	2025-03-28 03:00:00	\N	117802.42	6343.68	0.00	111458.74	0.00	CERTIFICADO DIGITAL eCPF,  eCNPJ  E CERTIFICADO SSL WILDCARD				E0220947	Assinado	359.00001019/2025-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
919	DAIANE DA SILVA SOUZA	MUNICIPIO DE EMBU-GUACU	SERVI??OS PREFEITURAS	PD251016	T0	Ativo		2024-04-01 03:00:00	2025-03-31 03:00:00	\N	246960.00	109872.78	0.00	137087.22	0.00	MULTAS CADASTRO				E0251019	Assinado  	359.00002427/2025-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
920	BARBARA ALMEIDA TUNES FERNANDES	HOSPITAL DAS CLINICAS DA FACULDADE DE MEDICINA DA U S P	HCFMUSP	PD024083	T0	Ativo		2024-04-02 03:00:00	2025-04-01 03:00:00	\N	2411864.16	930519.13	0.00	1481345.03	0.00	FOLHA PAGAMENTO				E0240128	Assinado	359.00001357/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
921	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD023030	T01	Ativo		2023-04-03 03:00:00	2025-04-02 03:00:00	\N	4774.20	4774.20	0.00	0.00	0.00	WORKSPACE AVANCADO				E0230037	24/03/25 - Em conversa com a Cristiane Quesada, essa demanda dever?? ser cancelada pois o produto foi descontinuado e somente ser?? garantido por 6 meses (PNPP 14027.2025)	359.00002272/2025-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
922	JUNEIDY SOLANGE BETECA JONY	COMPANHIA PAULISTA DE SECURITIZACAO	CPS	PD024136	T0	Ativo		2024-04-05 03:00:00	2025-04-04 03:00:00	\N	18.02	10.57	0.00	7.45	0.00	PROGRAMA SP SEM PAPEL				E0240232	Assinado	359.00003057/2024-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
923	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ORLANDIA	SERVI??OS PREFEITURAS	PD024625	T01	Ativo		2024-04-09 03:00:00	2025-04-08 03:00:00	\N	94752.00	41126.88	0.00	53625.12	0.00	PREFEITURA - CADASTRO				E0240625	Assinado  	359.00003011/2024-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
924	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PDC24016	T0	Ativo		2024-08-01 03:00:00	2025-04-16 03:00:00	\N	4133.07	1879.44	0.00	2253.63	0.00	PROGRAMA SP SEM PAPEL				EC240021	Assinado	359.00002142/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
925	NADIA BERTUCCELLI	MUNICIPIO DE ILHA SOLTEIRA	SERVI??OS PREFEITURAS	PD023621	T02	Ativo		2024-04-10 03:00:00	2025-04-09 03:00:00	\N	8388.00	4194.00	0.00	4194.00	0.00	PREFEITURA - CADASTRO				E0230621	Assinado  	359.00005254/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
926	DAIANE DA SILVA SOUZA	MUNICIPIO DE TERRA ROXA	SERVI??OS PREFEITURAS	PD023633	T02	Ativo		2024-04-10 03:00:00	2025-04-09 03:00:00	\N	8388.00	4322.15	0.00	4065.85	0.00	PREFEITURA - CADASTRO				E0230633	Assinado  	359.00002974/2024-44									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
927	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE COLINA	SERVI??OS PREFEITURAS	PD021703	T04	Ativo		2024-04-12 03:00:00	2025-04-11 03:00:00	\N	10579.20	4165.56	0.00	6413.64	0.00	PREFEITURA - CADASTRO				E0210703	Assinado  	359.00005529/2024-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
928	NADIA BERTUCCELLI	MUNICIPIO DE POTIM	SERVI??OS PREFEITURAS	PD021644	T04	Ativo		2024-04-13 03:00:00	2025-04-12 03:00:00	\N	25281.60	4078.53	0.00	21203.07	0.00	PREFEITURA - SIM				E0210644	Assinado  	359.00003212/2024-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
929	NADIA BERTUCCELLI	MUNICIPIO DE PINDAMONHANGABA	SERVI??OS PREFEITURAS	PD251031	T04	Ativo		2024-10-16 03:00:00	2025-04-15 03:00:00	\N	1675189.32	598995.90	0.00	1076193.42	0.00	PREFEITURA - CADASTRO				E0251038	Assinado  	359.00002035/2025-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
930	NADIA BERTUCCELLI	MUNICIPIO DE CHARQUEADA	SERVI??OS PREFEITURAS	PD022514	T03	Ativo		2024-04-17 03:00:00	2025-04-16 03:00:00	\N	21425.76	5860.17	0.00	15565.59	0.00	PREFEITURA - SIM				E0220514	Assinado  	359.00003024/2024-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
931	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CARAPICUIBA	SERVI??OS PREFEITURAS	PD024623	T01	Ativo		2024-04-17 03:00:00	2025-04-16 03:00:00	\N	2041200.00	972180.46	0.00	1069019.54	0.00	PREFEITURA - CADASTRO				E0240623	Assinado  	359.00002919/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
932	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BOITUVA	SERVI??OS PREFEITURAS	PD020757	T05	Ativo		2024-04-18 03:00:00	2025-04-17 03:00:00	\N	45561.30	45561.30	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0200757	Assinado  	359.00003367/2024-00									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
933	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO BERNARDO DO CAMPO	SERVI??OS PREFEITURAS	PD022504	T04	Ativo		2024-04-18 03:00:00	2025-04-17 03:00:00	\N	5497080.00	2322170.93	0.00	3174909.07	0.00	PREFEITURA - CADASTRO				E0220504	Assinado  	359.00002750/2024-32									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
934	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD023472	T01	Ativo		2024-12-18 03:00:00	2025-04-17 03:00:00	\N	185368.32	88015.93	0.00	97352.39	0.00	NUVEM PRODESP  E SUPORTE T??CNICO				E0230595	Assinado	359.00009146/2023-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
935	JUNEIDY SOLANGE BETECA JONY	FUNDACAO PRO-SANGUE HEMOCENTRO DE SAO PAULO	FUNDHESP	PD023046	T01	Ativo		2024-05-01 03:00:00	2025-04-30 03:00:00	\N	84182.40	37303.20	0.00	46879.20	0.00	NUVEM PRODESP				E0230055	Assinado	359.00000025/2023-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
937	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD022408	T02	Ativo		2024-05-01 03:00:00	2025-04-30 03:00:00	\N	6901715.66	3211840.41	0.00	3689875.25	0.00	NUVEM P??BLICA				E0220489	Assinado	359.00001019/2024-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
938	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PRESIDENTE PRUDENTE	SERVI??OS PREFEITURAS	PD022535	T03	Ativo		2024-05-02 03:00:00	2025-05-01 03:00:00	\N	1238640.00	493748.83	0.00	744891.17	0.00	PREFEITURA - CADASTRO				E0220535	Assinado  	359.00003682/2024-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
939	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE TIETE	SERVI??OS PREFEITURAS	PD024628	T01	Ativo		2024-05-03 03:00:00	2025-05-02 03:00:00	\N	27120.00	4350.50	0.00	22769.50	0.00	PREFEITURA - CADASTRO				E0240628	Assinado  	359.00003452/2024-60									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
936	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE FRANCA	PREFEITURA	PD023205	T02	Ativo	\N	2024-05-02 09:00:00	2025-05-01 09:00:00	\N	1382040.00	691020.00	0.00	691020.00	0.00	OFFICE BASICO	\N	\N	\N	E0230235	Assinado (Renovado no PD025084)	359.00000009/2023-56	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
940	DAIANE DA SILVA SOUZA	MUNICIPIO DE TAQUARITUBA	SERVI??OS PREFEITURAS	PD024629	T01	Ativo		2024-05-03 03:00:00	2025-05-02 03:00:00	\N	8136.00	4068.00	0.00	4068.00	0.00	PREFEITURA - CADASTRO				E0240629	Assinado  	359.00003536/2024/01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
941	NADIA BERTUCCELLI	MUNICIPIO DE RANCHARIA	SERVI??OS PREFEITURAS	PD024635	T01	Ativo		2024-05-03 03:00:00	2025-05-02 03:00:00	\N	10848.00	3390.00	0.00	7458.00	0.00	PREFEITURA - CADASTRO				E0240635	Assinado  	359.00003403/2024-27									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
942	DAIANE DA SILVA SOUZA	PREFEITURA MUNICIPAL DE SALTO DE PIRAPORA	SERVI??OS PREFEITURAS	PD024634	T01	Ativo		2024-05-07 03:00:00	2025-05-06 03:00:00	\N	32754.24	13061.23	0.00	19693.01	0.00	PREFEITURA - SIM				E0240634	Assinado	359.00003457/2024-92									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
943	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CERQUILHO	SERVI??OS PREFEITURAS	PD023625	T02	Ativo		2024-05-08 03:00:00	2025-05-07 03:00:00	\N	25185.60	7404.10	0.00	17781.50	0.00	PREFEITURA - CADASTRO				E0230625	Assinado	359.00005435/2024-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
944	NADIA BERTUCCELLI	MUNICIPIO DE ARARAS	SERVI??OS PREFEITURAS	PD023627	T02	Ativo		2024-05-10 03:00:00	2025-05-09 03:00:00	\N	885840.00	147777.04	0.00	738062.96	0.00	PREFEITURA - CADASTRO				E0230627	Assinado  	359.00005362/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
945	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD024038	T0	Ativo		2024-05-22 03:00:00	2025-05-21 03:00:00	\N	1036.70	493.26	0.00	543.44	0.00	PROGRAMA SP SEM PAPEL				E0240050	Assinado	359.00001980/2024-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
946	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD022144	T02	Ativo		2024-05-19 03:00:00	2025-05-18 03:00:00	\N	474420.24	209655.56	0.00	264764.68	0.00	SISTEMA GABINETE VIRTUAL - ARQUIVAMENTO				E0220185	Assinado	359.00000230/2023-12									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
947	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022145	T01	Ativo		2024-11-24 03:00:00	2025-05-23 03:00:00	\N	1230437.44	901107.36	0.00	329330.08	0.00	MANUTEN????O SISTEMA, PAAS JBOSS,INFRAESTRUTURA  VIRTUALIZADA ON PREMISES (IAAS)AVAN??ADA COM GERENCIAMENTO, CERTIFICADO SSL STANDARD-OV(RAIZ INTERNACIONAL)				E0220188	Assinado	359.00009232/2024-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
948	NADIA BERTUCCELLI	MUNICIPIO DE VARZEA PAULISTA	SERVI??OS PREFEITURAS	PD021708	T04	Ativo		2024-05-28 03:00:00	2025-05-27 03:00:00	\N	600600.00	217693.04	0.00	382906.96	0.00	PREFEITURA - CADASTRO				E0210708	Assinado  	359.00004942/2024-83									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
949	DAIANE DA SILVA SOUZA	MUNICIPIO DE VOTUPORANGA	SERVI??OS PREFEITURAS	PD023630	T02	Ativo		2024-05-28 03:00:00	2025-05-27 03:00:00	\N	332160.00	118941.04	0.00	213218.96	0.00	PREFEITURA - CADASTRO				E0230630	Assinado  	359.00005783/2024-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
950	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PORTO FERREIRA	SERVI??OS PREFEITURAS	PD021645	T04	Ativo		2024-05-29 03:00:00	2025-05-28 03:00:00	\N	325386.31	48464.65	0.00	276921.66	0.00	PREFEITURA - SIM				E0210645	Assinado  	359.00004647/2024-27									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
951	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD022324	T0	Ativo		2022-11-29 03:00:00	2025-05-28 03:00:00	\N	13199.68	1945.14	0.00	11254.54	0.00	PROGRAMA SP SEM PAPEL				E0220423	Assinado	359.00002315/2025-99									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
952	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DA BAIXADA SANTISTA - AGEM	AGEM	PD021229	T03	Ativo		2024-03-01 03:00:00	2025-05-31 03:00:00	\N	3292.49	736.09	0.00	2556.40	0.00	FOLHA DE PAGAMENTO				E0210293	Assinado	359.00002536/2024-86									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
953	DAIANE DA SILVA SOUZA	MUNICIPIO DE MAIRINQUE	SERVI??OS PREFEITURAS	PD023606	T02	Ativo		2024-06-01 03:00:00	2025-05-31 03:00:00	\N	84405.60	65962.55	0.00	18443.05	0.00	PREFEITURA - SIM				E0230606	Assinado  	359.00005361/2024-69									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
955	NADIA BERTUCCELLI	MUNICIPIO DE PAULINIA	SERVI??OS PREFEITURAS	PD024607	T0	Ativo		2024-06-11 03:00:00	2025-06-10 03:00:00	\N	2194838.88	553195.98	0.00	1641642.90	0.00	PREFEITURA - CADASTRO				E0240607	Assinado  	359.00004494/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
956	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE COSMOPOLIS	SERVI??OS PREFEITURAS	PD024630	T0	Ativo		2024-06-11 03:00:00	2025-06-10 03:00:00	\N	41887.20	5100.78	0.00	36786.42	0.00	PREFEITURA - CADASTRO				E0240630	Assinado  	359.00004475/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
957	NADIA BERTUCCELLI	MUNICIPIO DE ALUMINIO	SERVI??OS PREFEITURAS	PD024609	T0	Ativo		2024-06-13 03:00:00	2025-06-12 03:00:00	\N	10809.60	2702.40	0.00	8107.20	0.00	PREFEITURA - CADASTRO				E0240609	Assinado  	359.00005100/2024-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
958	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PD021339	T01	Ativo		2024-06-14 03:00:00	2025-06-13 03:00:00	\N	29526.44	29526.43	0.00	0.01	0.00	PROGRAMA SP SEM PAPEL				E0210444	Assinado	359.00004500/2024-37 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
959	DAIANE DA SILVA SOUZA	MUNICIPIO DE ARARAQUARA	SERVI??OS PREFEITURAS	PD023642	T01	Ativo		2024-06-13 03:00:00	2025-06-13 03:00:00	\N	885480.00	536068.81	0.00	349411.19	0.00	PREFEITURA - CADASTRO				E0230642	Assinado  	359.00003975/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
960	NADIA BERTUCCELLI	MUNICIPIO DE SERTAOZINHO	SERVI??OS PREFEITURAS	PD021718	T03	Ativo		2024-06-16 03:00:00	2025-06-15 03:00:00	\N	363240.00	27462.61	0.00	335777.39	0.00	PREFEITURA - CADASTRO				E0210718	Contrato Assinado	359.00006537/2024-08									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
961	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA CRUZ DO RIO PARDO	SERVI??OS PREFEITURAS	PD021712	T03	Ativo		2024-06-16 03:00:00	2025-06-15 03:00:00	\N	75312.00	9131.58	0.00	66180.42	0.00	PREFEITURA - CADASTRO				E0210712	Assinado  	359.00005532/2024-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
962	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SOROCABA	SERVI??OS PREFEITURAS	PD021705	T03	Ativo		2024-06-17 03:00:00	2025-06-16 03:00:00	\N	2202000.00	661053.83	0.00	1540946.17	0.00	PREFEITURA - CADASTRO				E0210705	Assinado  	359.00004254/2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
964	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD024067	T0	Ativo		2024-06-18 03:00:00	2025-06-17 03:00:00	\N	419.61	174.85	0.00	244.76	0.00	PROGRAMA SP SEM PAPEL				E0240098	Assinado	359.00000915/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
965	NADIA BERTUCCELLI	MUNICIPIO DE GUARAREMA	SERVI??OS PREFEITURAS	PD024612	T0	Ativo		2024-06-19 03:00:00	2025-06-18 03:00:00	\N	630480.00	130706.32	0.00	499773.68	0.00	PREFEITURA - CADASTRO				E0240612	Assinado  	359.00005286/2024-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
966	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD023248	T0	Ativo		2023-06-24 03:00:00	2025-06-23 03:00:00	\N	120291.52	9071.74	0.00	111219.78	0.00	FOLHA DE PAGAMENTO				E0230280	Assinado	359.00003915/2023-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
967	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITAQUAQUECETUBA	SERVI??OS PREFEITURAS	PD024641	T0	Ativo		2024-06-24 03:00:00	2025-06-23 03:00:00	\N	3790080.00	1062139.28	0.00	2727940.72	0.00	PREFEITURA - CADASTRO				E0240641	Assinado  	359.00005069/2024-46									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
954	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE ARUJA	PREFEITURA	PD022460	T01	Ativo	\N	2024-06-16 09:00:00	2025-06-15 09:00:00	\N	18619.50	18619.50	0.00	0.00	0.00	EMAIL COMO SERVI??O E OFFICE BASICO	\N	\N	\N	E0220904	Est?? em processo interno do cliente o novo contrato	359.00003238/2023-22	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
968	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CATANDUVA	SERVI??OS PREFEITURAS	PD024642	T0	Ativo		2024-06-25 03:00:00	2025-06-24 03:00:00	\N	398899.20	33858.82	0.00	365040.38	0.00	PREFEITURA - CADASTRO				E0240642	Assinado  	359.00005501/2024-07									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
969	DAIANE DA SILVA SOUZA	PREFEITURA MUNICIPAL DE QUATA	SERVI??OS PREFEITURAS	PD024622	T0	Ativo		2024-06-26 03:00:00	2025-06-25 03:00:00	\N	8107.20	3346.80	0.00	4760.40	0.00	PREFEITURA - CADASTRO				E0240622	Contrato Assinado	359.00005518/2024-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
971	NADIA BERTUCCELLI	MUNICIPIO DE BURI	SERVI??OS PREFEITURAS	PD024636	T0	Ativo		2024-06-27 03:00:00	2025-06-26 03:00:00	\N	33780.00	5539.92	0.00	28240.08	0.00	PREFEITURA - CADASTRO				E0240636	Assinado  	359.00003371/2024-60									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
972	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE NOVO HORIZONTE	SERVI??OS PREFEITURAS	PD024644	T0	Ativo		2024-06-28 03:00:00	2025-06-27 03:00:00	\N	135984.00	17269.84	0.00	118714.16	0.00	PREFEITURA - SIM				E0240644	Assinado  	359.00005749/2024-60									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
973	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD022067	T02	Ativo		2024-06-29 03:00:00	2025-06-28 03:00:00	\N	1482769.24	502494.35	0.00	980274.89	0.00	PAAS MIDDLEWARE COM SERVI??OS DE GEST??O AVAN??ADO				E0220091	Assinado	359.00000283/2023-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
974	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD023079	T01	Ativo		2024-06-29 03:00:00	2025-06-28 03:00:00	\N	10150057.92	2290470.64	0.00	7859587.28	0.00	ATENDIMENTO E SUPORTE DA CETTPRO				E0230091	Assinado	359.00002044/2023-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
975	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD023115	T02	Ativo		2024-06-29 03:00:00	2025-06-28 03:00:00	\N	2397467.65	568249.64	0.00	1829218.01	0.00	FOLHA DE PAGAMENTO				E0230134	Assinado	359.00002922/2023-97 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
976	NADIA BERTUCCELLI	MUNICIPIO DE PENAPOLIS	SERVI??OS PREFEITURAS	PD021715	T03	Ativo		2024-06-30 03:00:00	2025-06-29 03:00:00	\N	19242.00	7066.09	0.00	12175.91	0.00	PREFEITURA - CADASTRO				E0210715	Assinado  	359.00005531-2024-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
979	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD022351	T02	Ativo		2024-04-01 03:00:00	2025-06-30 03:00:00	\N	1009086.45	180393.81	0.00	828692.64	0.00	FOLHA DE PAGAMENTO				E0220458	Assinado	359.00002845/2024-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
980	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023080	T02	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	836930.16	185748.88	0.00	651181.28	0.00	HELP DESK, INTRAGOV E CHAMADO TECNICO				E0230092	Assinado	359.00003051/2023-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
981	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023101	T01	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	7094397.71	2285508.16	0.00	4808889.55	0.00	INFRAESTRUTURA SOLUCAO ATTORNATUS E SISTEMAS PRECAT??RIOS				E0230120	Assinado	359.00003024/2023-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
983	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PRADOPOLIS	SERVI??OS PREFEITURAS	PD024605	T0	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	8121.60	2707.20	0.00	5414.40	0.00	PREFEITURA - CADASTRO				E0240605	Contrato Assinado	359.00005334-2024-96 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
984	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESOS E MEDIDAS DO ESTADO DE SAO PAULO	IPEM	PD023449	T0	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	1057.80	349.92	0.00	707.88	0.00	PROGRAMA SP SEM PAPEL				E0230556	Assinado	359.00005647/2024-44									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
985	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	SEADE	PD024116	T0	Ativo		2024-07-01 03:00:00	2025-06-30 03:00:00	\N	356.90	118.24	0.00	238.66	0.00	PROGRAMA SP SEM PAPEL				E0240169	Assinado	359.00004449/2024-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
986	NADIA BERTUCCELLI	MUNICIPIO DE PRESIDENTE VENCESLAU	SERVI??OS PREFEITURAS	PD021720	T03	Ativo		2024-07-17 03:00:00	2025-07-16 03:00:00	\N	8194.90	8194.90	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0210720	Assinado  	359.00006320/2024-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
987	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD024071	T0	Ativo		2024-07-17 03:00:00	2025-07-16 03:00:00	\N	9843094.29	6051041.39	0.00	3792052.90	0.00	DESENVOLVIMENTO E SUSTENTA????O DA PLATAFORMA PORTAL DE OPORTUNIDADES SDE 360				E0240104	Assinado	359.00005866/2024-23									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
988	DAIANE DA SILVA SOUZA	MUNICIPIO DE HOLAMBRA	SERVI??OS PREFEITURAS	PD024613	T0	Ativo		2024-07-17 03:00:00	2025-07-16 03:00:00	\N	103737.60	18665.34	0.00	85072.26	0.00	PREFEITURA - SIM				E0240613	Assinado  	359.00005293/2024-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
989	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024006	T01	Ativo		2025-01-18 03:00:00	2025-07-17 03:00:00	\N	6556053.48	2764690.14	0.00	3791363.34	0.00	OUTSOURCING				E0240006	Assinado	359.00005428/2024-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
990	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD024052	T01	Ativo		2025-01-18 03:00:00	2025-07-17 03:00:00	\N	15184451.76	7028745.22	0.00	8155706.54	0.00	SUSTENTA????O DO SISTEMA GEDAVE				E0240074	Assinado	359.00005451/2024-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
991	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MIRASSOL	SERVI??OS PREFEITURAS	PD024650	T0	Ativo		2024-07-19 03:00:00	2025-07-18 03:00:00	\N	65055.12	6699.69	0.00	58355.43	0.00	PREFEITURA - SIM				E0240650	Assinado  	359.00006322/2024-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
992	NADIA BERTUCCELLI	PREFEITURA MUNICIPAL DE FERNANDOPOLIS	SERVI??OS PREFEITURAS	PD021722	T03	Ativo		2024-07-24 03:00:00	2025-07-23 03:00:00	\N	85512.00	6871.50	0.00	78640.50	0.00	PREFEITURA - CADASTRO				E0210722	Contrato Assinado	359.00006190/2024-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
993	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CANDIDO MOTA	SERVI??OS PREFEITURAS	PD023647	T01	Ativo		2024-07-25 03:00:00	2025-07-24 03:00:00	\N	20682.00	2068.20	0.00	18613.80	0.00	PREFEITURA - CADASTRO				E0230647	Assinado  	359.00006662/2024-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
995	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAMPO LIMPO PAULISTA	SERVI??OS PREFEITURAS	PD024661	T0	Ativo		2024-07-25 03:00:00	2025-07-24 03:00:00	\N	383520.00	27963.12	0.00	355556.88	0.00	PREFEITURA - CADASTRO				E0240661	Assinado  	359.00006383/2024-46									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
982	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023123	T02	Ativo	\N	2025-07-01 03:00:00	2026-06-30 03:00:00	\N	121380.00	10052.70	0.00	111327.30	0.00	SMS	\N	\N	\N	E0230146	Assinado	359.00007058/2023-10	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
994	PAULO MARCELLO DA SILVA FERREIRA	CONSELHO DE ARQUITETURA E URBANISMO DE SAO PAULO (CAU-SP)	CAU - SP	PD024105	T1	Ativo	\N	2025-07-25 03:00:00	2026-07-24 03:00:00	\N	1732413.76	292371.20	0.00	1440042.56	0.00	SUSTENTACAO DA PLATAFORMA CRM OMNICHANNEL	\N	\N	\N	E0240155	Assinado	359.0000.4186/2024-92	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
977	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD019146	T04	Renovado	\N	2024-07-01 03:00:00	2025-06-30 03:00:00	\N	240.45	240.45	0.00	0.00	0.00	CONSULTA E EXTRACOES DE DADOS FOLHA DE PAGAMENTO	\N	\N	\N	E0190197	Renovado no PD025241	359.00003554/2023-02	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
978	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD019194	T04	Renovado	\N	2024-07-01 03:00:00	2025-06-30 03:00:00	\N	2881.58	2881.59	0.00	0.00	0.00	PORTAL PROCON	\N	\N	\N	E0190252	Assinado (Renovado no PD025243)	359.00005016/2023-44	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
996	NADIA BERTUCCELLI	MUNICIPIO DE SAO CAETANO DO SUL	SERVI??OS PREFEITURAS	PD024637	T0	Ativo		2024-07-26 03:00:00	2025-07-25 03:00:00	\N	3009120.00	557138.05	0.00	2451981.95	0.00	PREFEITURA - CADASTRO				E0240637	Assinado  	359.00005906/2024-37									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
997	DAIANE DA SILVA SOUZA	MUNICIPIO DE ARACATUBA	SERVI??OS PREFEITURAS	PD021717	T03	Ativo		2024-07-29 03:00:00	2025-07-28 03:00:00	\N	457680.00	101623.64	0.00	356056.36	0.00	PREFEITURA - CADASTRO				E0210717	Assinado  	359.00005966/2024-50									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
999	NADIA BERTUCCELLI	MUNICIPIO DE LENCOIS PAULISTA	SERVI??OS PREFEITURAS	PD024670	T0	Ativo		2024-08-01 03:00:00	2025-07-31 03:00:00	\N	176112.00	30864.66	0.00	145247.34	0.00	PREFEITURA - CADASTRO				E0240670	Assinado	359.00006572/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1000	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD023233	T0	Ativo		2023-08-01 03:00:00	2025-07-31 03:00:00	\N	7581062.71	629097.92	0.00	6951964.79	0.00	MANUTEN????O SISTEMA SGGD				E0230265	Assinado	359.00004261/2023-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1001	NADIA BERTUCCELLI	MUNICIPIO DE IPERO	SERVI??OS PREFEITURAS	PD022571	T02	Ativo		2024-08-02 03:00:00	2025-08-01 03:00:00	\N	83181.60	4218.10	0.00	78963.50	0.00	PREFEITURA - SIM				E0220571	Contrato Assinado	359.00006784/2024-04									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1002	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	SEC. CULTURA	PD022348	T02	Ativo		2024-08-29 03:00:00	2025-08-28 03:00:00	\N	246683.48	29830.11	0.00	216853.37	0.00	NUVEM PRODESP				E0220453\nE0220454	Assinado	359.00005659/2023-98									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1003	DAIANE DA SILVA SOUZA	COMPANHIA MUNICIPAL DE TRANSITO -CMT	SERVI??OS PREFEITURAS	PD024672	T0	Ativo		2024-08-16 03:00:00	2025-08-15 03:00:00	\N	1194000.00	79298.58	0.00	1114701.42	0.00	PREFEITURA - CADASTRO				E0240672	Assinado	359.00006649/2024-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1004	NADIA BERTUCCELLI	MUNICIPIO DE GUARA	SERVI??OS PREFEITURAS	PD024680	T0	Ativo		2024-08-16 03:00:00	2025-08-15 03:00:00	\N	10819.20	2028.60	0.00	8790.60	0.00	PREFEITURA - CADASTRO				E0240680	Assinado	359.00006984/2024-59									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1005	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE JALES	SERVI??OS PREFEITURAS	PD024614	T0	Ativo		2024-08-22 03:00:00	2025-08-21 03:00:00	\N	197160.00	22066.66	0.00	175093.34	0.00	PREFEITURA - CADASTRO				E0240614	Assinado	359.00007091/2024-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1006	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTO ANTONIO DE POSSE	SERVI??OS PREFEITURAS	PD024667	T0	Ativo		2024-08-22 03:00:00	2025-08-21 03:00:00	\N	44841.60	2787.68	0.00	42053.92	0.00	PREFEITURA - SIM				E0240667	Assinado	359.00006508/2024-38									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1007	NADIA BERTUCCELLI	MUNICIPIO DE SEVERINIA	SERVI??OS PREFEITURAS	PD024674	T0	Ativo		2024-08-23 03:00:00	2025-08-22 03:00:00	\N	16228.80	2028.60	0.00	14200.20	0.00	PREFEITURA - CADASTRO				E0240674	Assinado	359.00006733/2024-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1008	DAIANE DA SILVA SOUZA	MUNICIPIO DE IPUA	SERVI??OS PREFEITURAS	PD023657	T01	Ativo		2024-08-25 03:00:00	2025-08-24 03:00:00	\N	17487.60	2017.80	0.00	15469.80	0.00	PREFEITURA - CADASTRO				E0230657	Assinado	359.00005960/2023-00									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1009	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE AMPARO	SERVI??OS PREFEITURAS	PD024656	T0	Ativo		2024-08-27 03:00:00	2025-08-26 03:00:00	\N	855948.84	69268.96	0.00	786679.88	0.00	PREFEITURA - CADASTRO				E0240656	Assinado	359.00007659/2024-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1010	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD021190	T05	Ativo		2025-02-27 03:00:00	2025-08-26 03:00:00	\N	8058376.08	2656574.79	0.00	5401801.29	0.00	SERVI??O DE SUPORTE ESPECIALIZADO LOCAL				E0210231	Assinado	359.00003549/2023-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1011	NADIA BERTUCCELLI	MUNICIPIO DE OURINHOS	SERVI??OS PREFEITURAS	PD024684	T0	Ativo		2024-08-29 03:00:00	2025-08-28 03:00:00	\N	382920.00	38030.32	0.00	344889.68	0.00	PREFEITURA - CADASTRO				E0240684	Assinado	359.00007484/2024-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1013	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023105	T01	Ativo		2024-09-01 03:00:00	2025-08-31 03:00:00	\N	6167016.00	1026660.00	0.00	5140356.00	0.00	PAAS BANCO DE DADOS ORACLE - VPN				E0230124	Assinado	359.00001744/2023-87									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1014	MARTA MARIA NOVAES DE ALC??NTARA	AGENCIA DE AGUAS DO ESTADO DE SAO PAULO - SP-AGUAS	SP-AGUAS	PD023251	T03	Ativo		2025-06-04 03:00:00	2025-09-03 03:00:00	\N	4739920.95	954425.53	0.00	3785495.42	0.00	MANUTEN????O DOS SISTEMAS GERENCIA DOS RECURSOS HIDRICOS				E0230284\nE0230285\nE0230286\nE0230287\nE0230288	Assinado	359.00002448/2023-01									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1015	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PARAGUACU PAULISTA	SERVI??OS PREFEITURAS	PD024659	T01	Ativo		2024-09-04 03:00:00	2025-09-03 03:00:00	\N	47334.00	2006.06	0.00	45327.94	0.00	PREFEITURA - CADASTRO				E0240659	Assinado	359.00006226/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1016	NADIA BERTUCCELLI	MUNICIPIO DE ARACARIGUAMA	SERVI??OS PREFEITURAS	PD022543	T02	Ativo		2024-09-06 03:00:00	2025-09-05 03:00:00	\N	68880.00	4144.28	0.00	64735.72	0.00	PREFEITURA - CADASTRO				E0220543	Assinado	359.00005981/2024-06									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1017	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023401	T0	Ativo		2024-09-06 03:00:00	2025-09-05 03:00:00	\N	3748900.63	2290964.55	0.00	1457936.08	0.00	PLATAFORMA PAAS E OFFICE PLUS				E0230491	Assinado	359.00000200/2024-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1018	AMANDA ESTEVES	MUNICIPIO DE PITANGUEIRAS	SERVI??OS PREFEITURAS	PD024658	T00	Ativo		2024-09-06 03:00:00	2025-09-05 03:00:00	\N	37181.57	2154.41	0.00	35027.16	0.00	PREFEITURA - CADASTRO				E0240658	 Assinado 	359.00006267/2024-27									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1019	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD024338	T0	Ativo		2024-09-08 03:00:00	2025-09-07 03:00:00	\N	381312.24	63552.04	0.00	317760.20	0.00	OFFICE B??SICO				E0240482	Assinado	359.00006873/2024-42\n359.00006916/2025-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1020	JUNEIDY SOLANGE BETECA JONY	FUND PROF DR MANOEL PEDRO PIMENTEL	FUNAP	PD022292	T02	Ativo		2024-09-09 03:00:00	2025-09-08 03:00:00	\N	8623.20	1437.20	0.00	7186.00	0.00	SAM PATRIMONIO				E0220384	Assinado	359.00004935/2023-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1021	DAIANE DA SILVA SOUZA	MUNICIPIO DE CABREUVA	SERVI??OS PREFEITURAS	PD024687	T01	Ativo		2024-09-10 03:00:00	2025-09-09 03:00:00	\N	260280.00	26995.40	0.00	233284.60	0.00	PREFEITURA - CADASTRO				E0240687	 Assinado 	359.00007616/2024-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1022	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD023018	T01	Ativo		2024-09-11 03:00:00	2025-09-10 03:00:00	\N	359164.89	30126.52	0.00	329038.37	0.00	SAM PATRIMONIO				E0230023	Assinado	359.00001502/2023-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1023	NADIA BERTUCCELLI	MUNICIPIO DE SANTANA DE PARNAIBA	SERVI??OS PREFEITURAS	PD022572	T03	Ativo		2024-09-12 03:00:00	2025-09-11 03:00:00	\N	1445760.00	150226.04	0.00	1295533.96	0.00	PREFEITURA - CADASTRO				E0220572	 Assinado 	359.00007155/2024-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1024	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE AGUAS DA PRATA	SERVI??OS PREFEITURAS	PD024689	T00	Ativo		2024-09-12 03:00:00	2025-09-11 03:00:00	\N	905.60	905.60	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240689	 Assinado 	359.00008006/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1012	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SANTA RITA D'OESTE	PREFEITURA	PD024284	T0	Ativo	\N	2024-09-10 09:00:00	2025-09-09 09:00:00	\N	1316.81	1316.81	0.00	-0.01	0.00	E-MAIL COMO SERVI??O, OFICCE BASICO-INTERMEDIARIO	\N	\N	\N	E0240420	Assinado	??35900006221/2024-16	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1025	NADIA BERTUCCELLI	MUNICIPIO DE AMERICANA	SERVI??OS PREFEITURAS	PD024681	T00	Ativo		2024-09-23 03:00:00	2025-09-22 03:00:00	\N	1071847.41	170053.49	0.00	901793.92	0.00	PREFEITURA - CADASTRO				E0240681	 Assinado 	359.00007013/2024-26									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1026	AMANDA ESTEVES	MUNICIPIO DE MORUNGABA	SERVI??OS PREFEITURAS	PD020786	T04	Ativo		2024-09-29 03:00:00	2025-09-28 03:00:00	\N	47304.00	9460.80	0.00	37843.20	0.00	PREFEITURA - CADASTRO				E0200786	Assinado	359.00008712/2024-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1027	DAIANE DA SILVA SOUZA	MUNICIPIO DE OSASCO	SERVI??OS PREFEITURAS	PD022553	T02	Ativo		2024-10-03 03:00:00	2025-10-02 03:00:00	\N	2652408.00	174560.04	0.00	2477847.96	0.00	PREFEITURA - CADASTRO				E0220553	Assinado	359.00008253/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1028	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD023030	T01	Ativo		2025-04-03 03:00:00	2025-10-02 03:00:00	\N	4774.20	4774.20	0.00	0.00	0.00	WORKSPACE AVANCADO				E0230037	Assinado (Renovado no PD251521 )	359.00009155/2025-17									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1029	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESPORTES	SEC. ESPORTES	PD023407	T01	Ativo		2024-10-26 03:00:00	2025-10-25 03:00:00	\N	1360.80	18.60	0.00	1342.20	0.00	PROGRAMA SP SEM PAPEL				E0230502	Assinado	359.00007274/2023-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1030	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD024313	T0	Ativo		2024-10-21 03:00:00	2025-10-20 03:00:00	\N	1694.22	72.03	0.00	1622.19	0.00	PROGRAMA SP SEM PAPEL				E0240452	Assinado	359.00008050/2024-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1031	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO CONSERV PROD FLORESTAL EST SP	FUND. FLORESTAL	PD024243	T0	Ativo		2024-10-20 03:00:00	2025-10-19 03:00:00	\N	190159.20	190159.20	0.00	0.00	0.00	OFFICE B??SICO				E0240371	Assinado (Renovado no PD251264)	359.00009353/2024-91									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1032	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD020055	T02	Ativo		2023-10-22 03:00:00	2025-10-21 03:00:00	\N	3685.67	3685.67	0.00	0.00	0.00	SISTEMA DE ADMINISTRA????O DE MATERIAIS  - SAM M??DULO PATRIM??NIO				E0200068	Assinado (Renovado no PD251198)	359.00003893/2023-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1033	DAIANE DA SILVA SOUZA	MUNICIPIO DE FRANCO DA ROCHA	SERVI??OS PREFEITURAS	PD022559	T02	Ativo		2024-10-22 03:00:00	2025-10-21 03:00:00	\N	991800.00	26623.39	0.00	965176.61	0.00	PREFEITURA - CADASTRO				E0220559	Assinado	359.00009109/2024-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1034	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PIRACAIA	SERVI??OS PREFEITURAS	PD024705	T0	Ativo		2024-10-22 03:00:00	2025-10-21 03:00:00	\N	22408.80	1494.16	0.00	20914.64	0.00	PREFEITURA - SIM				E0240705	Assinado	359.00009322/2024-31									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1035	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DE SOROCABA - AGEMSOROCABA	AGEMSOROCABA	PD024351	T0	Ativo		2024-10-23 03:00:00	2025-10-22 03:00:00	\N	15581.28	65.24	0.00	15516.04	0.00	FOLHA DE PAGAMENTO				E0240497	Assinado	359.0000.6696/2024-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1036	NADIA BERTUCCELLI	MUNICIPIO DE AGUAS DE LINDOIA	SERVI??OS PREFEITURAS	PD022555	T02	Ativo		2024-10-24 03:00:00	2025-10-23 03:00:00	\N	530640.00	4962.20	0.00	525677.80	0.00	PREFEITURA - CADASTRO				E0220555	Assinado	359.00009124/2024-77									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1037	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE JUQUIA	SERVI??OS PREFEITURAS	PD022556	T03	Ativo		2024-10-24 03:00:00	2025-10-23 03:00:00	\N	86550.00	6762.44	0.00	79787.56	0.00	PREFEITURA - CADASTRO				E0220556	Assinado	359.00009364/2024-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1038	DAIANE DA SILVA SOUZA	MUNICIPIO DE IRACEMAPOLIS	SERVI??OS PREFEITURAS	PD022583	T02	Ativo		2024-10-24 03:00:00	2025-10-23 03:00:00	\N	20772.00	1523.28	0.00	19248.72	0.00	PREFEITURA - CADASTRO				E0220583	Assinado	359.00009104/2024-04									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1039	NADIA BERTUCCELLI	EMPRESA MUNICIPAL DE MOBILIDADE URBANA DE MARILIA - EMDURB	SERVI??OS PREFEITURAS	PD023685	T01	Ativo		2024-10-25 03:00:00	2025-10-24 03:00:00	\N	1746480.00	993030.79	0.00	753449.21	0.00	PREFEITURA - CADASTRO				E0230685	Renovado no PD251656	359.00009013/2023-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1040	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE TURISMO E VIAGENS	SEC. TURISMO	PD024356	T0	Renovado		2024-11-04 03:00:00	2025-11-03 03:00:00	\N	81177.00	80500.53	0.00	676.47	0.00	OFFICE BASICO				E0240502	Renovado no???PD251420	359.00009204/2023-41						???PD251420			2025-12-09 17:19:01.908	2025-12-15 14:59:23.077
1041	NADIA BERTUCCELLI	MUNICIPIO DE CAJAMAR	SERVI??OS PREFEITURAS	PD024662	T0	Ativo		2024-10-31 03:00:00	2025-10-30 03:00:00	\N	2970008.49	47056.66	0.00	2922951.83	0.00	PREFEITURA - CADASTRO				E0240662	Assinado	359.00006534/2024-66									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1042	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD022120	T02	Ativo		2024-11-01 03:00:00	2025-10-31 03:00:00	\N	1468548.00	115637.42	0.00	1352910.58	0.00	INTRAGOV				E0220159	Assinado	359.00007128/2023-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1043	DAIANE DA SILVA SOUZA	MUNICIPIO DE GUARULHOS	SERVI??OS PREFEITURAS	PD022531	T02	Ativo		2024-11-01 03:00:00	2025-10-31 03:00:00	\N	7304418.00	280975.30	0.00	7023442.70	0.00	PREFEITURA - CADASTRO				E0220531	Assinado	359.00007591/2024-62									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1044	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD024354	T0	Ativo		2024-11-01 03:00:00	2025-10-31 03:00:00	\N	5704903.92	3341428.31	0.00	2363475.61	0.00	NUVEM PUBLICA, RECURSOS  DE IaaS, PaaS, SaaS e OUTSOURCING				E0240500	Assinado	359.00009698/2024-45									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1045	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTO ANDRE	SERVI??OS PREFEITURAS	PD023672	T01	Ativo		2024-11-01 03:00:00	2025-10-31 03:00:00	\N	7772880.00	164894.42	0.00	7607985.58	0.00	PREFEITURA - CADASTRO				E0230672	Assinado	359.00007643/2023-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1046	NADIA BERTUCCELLI	MUNICIPIO DA ESTANCIA TURISTICA DE IBITINGA	SERVI??OS PREFEITURAS	PD023690	T01	Ativo		2024-11-01 03:00:00	2025-10-31 03:00:00	\N	40428.00	40057.41	0.00	370.59	0.00	PREFEITURA - CADASTRO				E0230690	Rnovado no PD251639	359.00007533/2023-58									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1047	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	SEADE	PD024391	T0	Ativo		2024-11-06 03:00:00	2025-11-05 03:00:00	\N	330647.64	313017.72	0.00	17629.92	0.00	OFFICE - E MAIL, BASICO, INTERMEDIARIO, PACOTES  ADICIONAIS				E0240545\nE0240546	Assinado	359.00007531/2024-40						PD025298			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1048	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CAPIVARI	SERVI??OS PREFEITURAS	PD024708	T0	Ativo		2024-11-06 03:00:00	2025-11-05 03:00:00	\N	365040.00	179577.60	0.00	185462.40	0.00	PREFEITURA - CADASTRO				E0240708	Servi??o bloqueado, cliente ainda n??o informou se far?? um contrato novo	359.00009898/2024-06									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1049	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE INDAIATUBA	SERVI??OS PREFEITURAS	PD024695	T0	Ativo		2024-11-07 03:00:00	2025-11-06 03:00:00	\N	1030789.32	446942.20	0.00	583847.12	0.00	PREFEITURA - CADASTRO				E0240695	Servi??o bloqueado, cliente ainda n??o informou se far?? um contrato novo	359.00008349/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1050	JUNEIDY SOLANGE BETECA JONY	SERVICO MUNICIPAL DE AGUA E ESGOTO	SEMAE	PD024350	T0	Ativo		2024-11-08 03:00:00	2025-11-07 03:00:00	\N	367487.40	345613.98	0.00	21873.42	0.00	EMAIL COMO SERVI??O, OFFICE B??SICO E SMTP				E0240496	Assinado	359.00006674/2024-34						PD251344			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1051	AMANDA ESTEVES	MUNICIPIO DE PONTAL	SERVI??OS PREFEITURAS	PD024709	T0	Ativo		2024-11-13 03:00:00	2025-11-12 03:00:00	\N	2792.40	2792.40	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240709	Assinado	359.00009870/2024-61						PD251693			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1052	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE TREMEMBE	SERVI??OS PREFEITURAS	PD022586	T02	Ativo		2024-11-16 03:00:00	2025-11-15 03:00:00	\N	24256.80	22426.31	0.00	1830.49	0.00	PREFEITURA - CADASTRO				E0220586	Assinado	359.00009463/2024-53						PD251630			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1053	JUNEIDY SOLANGE BETECA JONY	FUND PE ANCHIETA CENTRO PAULISTA RADIO E TV EDUCATIVAS	FPA	PD024358	T0	Ativo		2024-11-29 03:00:00	2025-11-28 03:00:00	\N	38100.00	34925.00	0.00	3175.00	0.00	OFFICE BASICO				E0240504	Assinado	359.00007095/2024-17						PD0251369			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1054	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE VIRADOURO	SERVI??OS PREFEITURAS	PD023691	T01	Ativo		2024-11-20 03:00:00	2025-11-19 03:00:00	\N	16171.20	10196.84	0.00	5974.36	0.00	PREFEITURA - CADASTRO				E0230691	Assinado	359.00007212/2023-53									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1055	AMANDA ESTEVES	MUNICIPIO DE SAO SIMAO	SERVI??OS PREFEITURAS	PD024699	T0	Ativo		2024-11-22 03:00:00	2025-11-21 03:00:00	\N	10310.40	8269.80	0.00	2040.60	0.00	PREFEITURA - CADASTRO				E0240699	Assinado	359.00008554/2024-71						PD251779			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1056	AMANDA ESTEVES	MUNICIPIO DE FERRAZ DE VASCONCELOS	SERVI??OS PREFEITURAS	PD020796	T04	Ativo		2024-11-24 03:00:00	2025-11-23 03:00:00	\N	1286760.00	594947.56	0.00	691812.44	0.00	PREFEITURA - CADASTRO				E0200796	Assinado	359.00010327/2024-14						PD251351			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1057	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022145	T02	Ativo		2025-05-24 03:00:00	2025-11-23 03:00:00	\N	1230437.44	901107.36	0.00	329330.08	0.00	MANUTEN????O SISTEMA, PAAS JBOSS,INFRAESTRUTURA  VIRTUALIZADA ON PREMISES (IAAS)AVAN??ADA COM GERENCIAMENTO, CERTIFICADO SSL STANDARD-OV(RAIZ INTERNACIONAL)				E0220188\nET220187	Assinado	359.00009232/2024-40									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1058	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DE SOROCABA - AGEMSOROCABA	AGEMSOROCABA	PD023355	T01	Ativo		2024-11-26 03:00:00	2025-11-25 03:00:00	\N	5433.12	5070.91	0.00	362.21	0.00	OFFICE  B??SICO				E0230433	Assinado	359.0000.8316/2023-85						PD251303			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1059	AMANDA ESTEVES	MUNICIPIO DE TANABI	SERVI??OS PREFEITURAS	PD020800	T04	Ativo		2024-11-28 03:00:00	2025-11-27 03:00:00	\N	8748.00	8019.00	0.00	729.00	0.00	PREFEITURA - CADASTRO				E0200800	Assinado	359.00009946/2024-58						PD251605			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1060	KARINA FREIRE GRANDA SALLES	FUNDACAO DE AMPARO E PESQUISA DO ESTADO DE SAO PAULO	FAPESP	PD020317	T03	Ativo		2024-11-30 03:00:00	2025-11-29 03:00:00	\N	3504.43	1273.03	0.00	2231.40	0.00	PROGRAMA SP SEM PAPEL				E0200412	Assinado	359.00009720/2024-57									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1062	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD023185	T01	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	60948.00	55869.00	0.00	5079.00	0.00	OFFICE B??SICO				E0230213	Assinado	359.00009459/2023-12						PD251281			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1064	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD022146	T02	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	118190156.04	53212765.21	0.00	64977390.83	0.00	GEST??O DE MULTAS				E0220190	Assinado	359.00005545/2023-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1065	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD023389	T0	Ativo		2023-12-01 03:00:00	2025-11-30 03:00:00	\N	1551471.58	1451332.54	0.00	100139.04	0.00	WaaS - WI-FI				E0230472	Assinado	359.00009001/2023-55						PD025311 			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1066	KARINA FREIRE GRANDA SALLES	COMPANHIA DOCAS DE SAO SEBASTIAO	DOCAS SAO SEBASTIAO	PD024379	T0	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	5433.12	4980.36	0.00	452.76	0.00	OFFICE B??SICO				E0240531	Assinado	359.00007687/2024-21						???PD0251349			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1067	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESOS E MEDIDAS DO ESTADO DE SAO PAULO	IPEM	PD024388	T0	Ativo		2024-12-01 03:00:00	2025-11-30 03:00:00	\N	187955.88	172292.89	0.00	15662.99	0.00	OFFICE B??SICO				E0240541	Assinado	359.00007513/2024-68						PD0251555			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1068	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD023238	T0	Ativo		2023-06-02 03:00:00	2025-12-01 03:00:00	\N	29585640.61	22307460.88	0.00	7278179.73	0.00	SERVI??OS DE MANUTEN????O E DESENVOLVIMENTO - SISTEMA SPA,  SISTEMA SPP, SISTEMA SGF,  PORTAL LIFERAY, APOIO OERACIONAL  E MICROFILMAGEM				E0230261\nE0230270\nE0230271	Assinado	359.00001498/2023-63						PD025285			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1069	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PRESIDENTE EPITACIO	SERVI??OS PREFEITURAS	PD024678	T00	Ativo		2024-12-10 03:00:00	2025-12-09 03:00:00	\N	12888.00	11212.56	0.00	1675.44	0.00	PREFEITURA - CADASTRO	PRORROGA????O		6. Aguardo Recebimento da Minuta Contratual do Cliente (60 a 30)	E0240678	04/12 - Cobrado retorno do cliente	359.00007333/2024-86									2025-12-09 17:19:01.908	2025-12-30 13:43:15.347
1070	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD020097	T04	Ativo		2024-12-07 03:00:00	2025-12-06 03:00:00	\N	5272.20	4832.85	0.00	439.35	0.00	M??DULO PATRIM??NIO - SAM				E0200113	Assinado	359.00008334/2024-48						PD251487 			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1071	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023401	T01	Ativo		2025-09-06 03:00:00	2025-12-05 03:00:00	\N	3748900.63	2290964.55	0.00	1457936.08	0.00	PLATAFORMA PAAS E OFFICE PLUS				E0230491	04/12 - Vai para a DEX hoje	359.00000200/2024-89						PD025185			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1072	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022392	T02	Ativo		2025-06-08 03:00:00	2025-12-07 03:00:00	\N	4236264.56	3643716.26	0.00	592548.30	0.00	INFRAESTRUTURA VIRTUALIZADA  ON PREMISES, PAAS  BANCO DADOS ORCLE ENTERPREISE, PAAS WEBSPHRE,PROCESSAMENTO IBM, IMPRESS??O, SMTP E CERTIFICADO SSL STANDARD				E0220826\nE0220827	Assinado	359.00009212/2024-79									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1073	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022406	T03	Ativo		2025-06-08 03:00:00	2025-12-07 03:00:00	\N	474611.45	29092.05	0.00	445519.40	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES, PAAS BANCO DE  DADOS MICROSOFT SQL,CERTIFICADO SSL STANDARD				E0220839\nE0220840	Assinado	359.00009225/2024-48									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1074	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD023129	T01	Ativo		2024-09-11 03:00:00	2025-12-10 03:00:00	\N	206733.85	185132.46	0.00	21601.39	0.00	MANUTEN????O SIGH-LAB				E0230152	 02/12/25 - Cliente infomou que encerrar??o o contrato	359.00000024/2023-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1075	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DE CAMPINAS - AGEMCAMP	AGEMCAMP	PD024061	T01	Ativo		2024-12-15 03:00:00	2025-12-14 03:00:00	\N	18939.00	16624.24	0.00	2314.76	0.00	OFFICE  BASICO				E0240092	Assinado	359.00000822/2024-15						PD251338			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1076	BARBARA ALMEIDA TUNES FERNANDES	SECRETARIA DE DESENVOLVIMENTO URBANO E HABITACAO	SDUH	PD022231	T02	Ativo		2024-12-16 03:00:00	2025-12-15 03:00:00	\N	13848847.72	4615442.11	0.00	9233405.61	0.00	INFRAESTRUTURA, HELP DESK, SUPORTE T??CNICO, SOLU????O MULTICLOUD, SMS, SMTP E PORTAL CORPORATIVO B??SICO				E0220301\nE0220302\nE0220324	Assinado	359.00008519/2023-71									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1077	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD023378	T01	Ativo		2024-12-15 03:00:00	2025-12-15 03:00:00	\N	76235.40	26495.18	0.00	49740.22	0.00	PROGRAMA SP SEM PAPEL				E0230461	01/12 - Em processo de assinatura	359.00009716/2023-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1063	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD020349	T03	Renovado	\N	2024-09-01 03:00:00	2025-11-30 03:00:00	\N	3028610.70	1223591.74	0.00	1805018.96	0.00	HOSPEDAGEM DE SERVIDORES, NUVEM PRODESP, STMP	\N	\N	\N	E0200451\nE0200452	Assinado	 35900001397/2023-92	\N	\N	\N	\N	\N	PD251327	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1078	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD024459	T0	Ativo		2024-12-17 03:00:00	2025-12-16 03:00:00	\N	12237.84	10198.20	0.00	2039.64	0.00	SAM ESTOQUE				E0241029	Assinado	359.00010377/2024-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1079	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BERTIOGA	SERVI??OS PREFEITURAS	PD023601	T03	Ativo		2025-12-21 03:00:00	2026-12-20 03:00:00	\N	2920680.00	1239342.68	0.00	1681337.32	0.00	PREFEITURA - CADASTRO	SEM TRATATIVA			E0230601		359.00010628/2024-30									2025-12-09 17:19:01.908	2025-12-30 13:44:37.194
1080	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD023448	T01	Ativo		2024-12-21 03:00:00	2025-12-21 03:00:00	\N	4175795.41	3721718.39	0.00	454077.02	0.00	NUVEM PUBLICA E PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0230555	CONTRATO NOVO FLAVIA minuta enviada 27/11 - AGUARDANDO MINUTA	359.00009705/2023-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1081	DAIANE DA SILVA SOUZA	MUNICIPIO DE PIRACICABA	SERVI??OS PREFEITURAS	PD024723	T0	Ativo		2024-12-20 03:00:00	2025-12-19 03:00:00	\N	1138200.00	826800.56	0.00	311399.44	0.00	PREFEITURA - CADASTRO				E0240723	08/12 - Aguardando retorno do cliente	359.00010994/2024-99									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1082	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD025022	T0	Ativo		2024-12-20 03:00:00	2025-12-19 03:00:00	\N	3320359.77	811643.54	0.00	2508716.23	0.00	MIDDLEWARE E GEST??O DE MIDDLEWARE				E0250027	"Fazer a rescis??o!!!!\n31/07/2025 - Cliente envia pedido de rescis??o\n25/09/2025 - Of??cio para assinatura do Bruno tramitado para GOR 2575796"	359.00010510/2024-10									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1083	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD024041	T01	Ativo		2024-12-29 03:00:00	2025-12-28 03:00:00	\N	378.92	295.88	0.00	83.04	0.00	PROGRAMA SP SEM PAPEL				E0240053	Assinado	359.00000078/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1084	JUNEIDY SOLANGE BETECA JONY	FUNDACAO ONCOCENTRO DE SAO PAULO	FOSP	PD020302	T04	Ativo		2025-01-01 03:00:00	2025-12-31 03:00:00	\N	26780.44	6931.30	0.00	19849.14	0.00	FOLHA DE PAGAMENTO				E0200393	02/12 - Est?? na GJU	359.00009569/2023-76									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1085	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD024479	T0	Ativo		2024-12-29 03:00:00	2025-12-28 03:00:00	\N	2854542.00	2378785.00	0.00	475757.00	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0241056	GJU 28/11	359.00011083/2024-89									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1086	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025027	T0-T1	Ativo		2024-12-29 03:00:00	2025-12-28 03:00:00	\N	1001435.40	804645.50	0.00	196789.90	0.00	OFFICE BASICO - E-MAIL COMO SERVI??O				E0250032	03/12 - PAJ PGE e COETIC -  Prevista a assinatura em 26/12/2025	359.00010728/2024-66						PD025296			2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1087	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAJURU	SERVI??OS PREFEITURAS	PD024726	T0	Ativo		2025-01-03 03:00:00	2026-01-02 03:00:00	\N	15465.60	10203.00	0.00	5262.60	0.00	PREFEITURA - CADASTRO				E0240726	03/12 - Aguardando retorno da ficha e da minuta	359.00011343/2024-16									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1088	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CRUZEIRO	SERVI??OS PREFEITURAS	PD024729	T0	Ativo		2025-01-03 03:00:00	2026-01-02 03:00:00	\N	4875.96	4875.96	0.00	0.00	0.00	PREFEITURA - CADASTRO				E0240729	03/12 - Aguardando retorno da ficha e da minuta	359.00011586/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1089	NADIA BERTUCCELLI	MUNICIPIO DE CAMPOS DO JORDAO	SERVI??OS PREFEITURAS	PD025081	T0	Ativo		2025-01-31 03:00:00	2026-01-30 03:00:00	\N	365040.00	354486.48	0.00	10553.52	0.00	PREFEITURA - CADASTRO				E0250095	03/12 - Aguardando retorno da ficha e da minuta	359.00000384/2025-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1091	NADIA BERTUCCELLI	MUNICIPIO DE BASTOS	SERVI??OS PREFEITURAS	PD021709	T04	Ativo		2025-03-19 03:00:00	2026-03-18 03:00:00	\N	8006.40	5359.84	0.00	2646.56	0.00	PREFEITURA - CADASTRO				E0210709											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1092	DAIANE DA SILVA SOUZA	MUNICIPIO DE JAGUARIUNA	SERVI??OS PREFEITURAS	PD025017	T0	Ativo		2025-03-20 03:00:00	2026-03-19 03:00:00	\N	542160.00	279559.92	0.00	262600.08	0.00	PREFEITURA - CADASTRO				E0250021		359.00001485/2025-56									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1093	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD024115	T0	Ativo		2024-04-10 03:00:00	2026-04-09 03:00:00	\N	7849.50	3047.69	0.00	4801.81	0.00	PROGRAMA SP SEM PAPEL				E0240168		359.00002209/2024-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1094	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO JOAQUIM DA BARRA	SERVI??OS PREFEITURAS	PD251017	T0	Ativo		2025-04-08 03:00:00	2026-04-07 03:00:00	\N	306000.00	55353.96	0.00	250646.04	0.00	PREFEITURA - CADASTRO				E0251020		359.00002449/2025-18									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1095	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DA CULTURA, ECONOMIA E INDUSTRIA CRIATIVAS	SEC. CULTURA	PDC24447	T0	Ativo		2025-02-10 03:00:00	2026-05-09 03:00:00	\N	116279.29	55728.86	0.00	60550.43	0.00	SAM ESTOQUE e SAM PATRIMONIO				E0241015		359.00008789/2024-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1096	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD025131	T0	Ativo		2025-05-10 03:00:00	2026-05-09 03:00:00	\N	4838217.10	1663949.60	0.00	3174267.50	0.00	EXPANS??O DO DATA LAKE /ANALYTICS E AI E Nuvem P??blica				E0250152		359.00002621/2025-25 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1097	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD022042	T1-T2	Ativo		2024-06-06 03:00:00	2026-06-05 03:00:00	\N	6776603.94	3310832.63	0.00	3465771.31	0.00	HELP DESK				E0220056		359.00005177/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1098	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023080	T02	Ativo		2025-07-01 03:00:00	2026-06-30 03:00:00	\N	836930.16	185748.88	0.00	651181.28	0.00	HELP DESK				E0230092		359.00003051/2023-29									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1099	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO SISTEMA EST ANALISE DADOS-SEADE	SEADE	PD024116	T01	Ativo		2025-07-01 03:00:00	2026-06-30 03:00:00	\N	356.90	118.24	0.00	238.66	0.00	PROGRAMA SP SEM PAPEL				E0240169		359.00004449/2024-63									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1100	MARIA REGINA FUNICELLO	IMPRENSA OFICIAL DO ESTADO DO RIO DE JANEIRO	IOERJ	PD025180	T0	Ativo		2025-07-01 03:00:00	2026-06-30 03:00:00	\N	641804.75	7920.64	0.00	633884.11	0.00	CERTIFICADO DIGITAL				E0250208		359.00002790/2025-65									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1101	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025187	T05	Ativo		2025-07-01 03:00:00	2026-06-30 03:00:00	\N	213091.92	71030.64	0.00	142061.28	0.00	SERVICOS DE REDE PRIVADA VIRTUAL - VPN				E0250217		359.00003523/2025-13									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1102	MARIA REGINA FUNICELLO	IMPRENSA OFICIAL DE SERGIPE - IOSE	IOSE	PD025188	T0	Ativo		2025-07-01 03:00:00	2026-06-30 03:00:00	\N	429850.17	29002.73	0.00	400847.44	0.00	CERTIFICADO DIGITAL				E0250218		359.00003311/2025-28									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1103	BARBARA ALMEIDA TUNES FERNANDES	COMPANHIA DE DESENVOLVIMENTO HABITACIONAL E URBANO DO ESTADO DE SAO PAULO - CDHU	CDHU	PD024451	T0	Ativo		2025-08-08 03:00:00	2026-08-07 03:00:00	\N	1536838.76	52668.05	0.00	1484170.71	0.00	NUVEM				E0241020											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1104	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD025118	T0	Ativo		2025-08-08 03:00:00	2026-08-07 03:00:00	\N	73392566.03	57080850.33	0.00	16311715.70	0.00	HIPERAUTOMA????O				E0250137		Fase 1 359.00008196/2024-05\nFase 2 359.00000895/2025-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1105	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO - IPT	IPT	PD025198	T0	Ativo		2025-11-08 03:00:00	2026-08-10 03:00:00	\N	42169.32	9372.18	0.00	32797.14	0.00	OFFICE				E0250231		359.00004369/2024-16 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1106	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD025246	T0	Ativo		2025-08-13 03:00:00	2026-08-12 03:00:00	\N	5479647.94	238573.36	0.00	5241074.58	0.00	GED				???E0250299		359.00005716/2025-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1107	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD025029	T0	Ativo		2025-08-14 03:00:00	2026-08-13 03:00:00	\N	1513807.19	1019288.07	0.00	494519.12	0.00	DESENVOLVIMENTO DE SISTEMAS				E0250244		359.00003880/2025-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1109	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ANGATUBA	SERVI??OS PREFEITURAS	PD024649	T01	Ativo		2025-09-16 03:00:00	2026-09-15 03:00:00	\N	10143.00	1352.40	0.00	8790.60	0.00	PREFEITURA CADASTRO				E0240649											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1110	NADIA BERTUCCELLI	MUNICIPIO DE VOTORANTIM	SERVI??OS PREFEITURAS	PD024677	T01	Ativo		2025-09-16 03:00:00	2026-09-15 03:00:00	\N	108672.00	10742.68	0.00	97929.32	0.00	PREFEITURA CADASTRO				E0240677											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1111	DAIANE DA SILVA SOUZA	MUNICIPIO DE POA	SERVI??OS PREFEITURAS	PD023674	T02	Ativo		2025-09-17 03:00:00	2026-09-16 03:00:00	\N	986880.00	97220.24	0.00	889659.76	0.00	PREFEITURA CADASTRO				E0230674											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1112	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PORTO FELIZ	SERVI??OS PREFEITURAS	PD024664	T01	Ativo		2025-09-17 03:00:00	2026-09-16 03:00:00	\N	135840.00	5309.08	0.00	130530.92	0.00	PREFEITURA CADASTRO				E0240664											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1113	NADIA BERTUCCELLI	MUNICIPIO DE ANDRADINA	SERVI??OS PREFEITURAS	PD024671	T01	Ativo		2025-09-18 03:00:00	2026-09-17 03:00:00	\N	135840.00	4731.76	0.00	131108.24	0.00	PREFEITURA CADASTRO				E0240671											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1117	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD023379	T02	Ativo		2025-09-30 03:00:00	2026-09-29 03:00:00	\N	39106.68	3104.59	0.00	36002.09	0.00	PROGRAMA SP SEM PAPEL				E0230462											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1118	NADIA BERTUCCELLI	MUNICIPIO DE PEDREIRA	SERVI??OS PREFEITURAS	PD251279	T0	Ativo		2025-01-10 03:00:00	2026-09-30 03:00:00	\N	56937.60	2768.25	0.00	54169.35	0.00	PREFEITURA - SIM				E0251379		359.00006234/2025-68									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1119	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD024313	T01	Ativo		2025-10-21 03:00:00	2026-10-20 03:00:00	\N	1694.22	72.03	0.00	1622.19	0.00	PROGRAMA SP SEM PAPEL				E0240452											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1120	DAIANE DA SILVA SOUZA	MUNICIPIO DE ESPIRITO SANTO DO PINHAL	SERVI??OS PREFEITURAS	PD024691	T01	Ativo		2025-10-16 03:00:00	2026-10-15 03:00:00	\N	50670.00	1024.66	0.00	49645.34	0.00	PREFEITURA CADASTRO				E0240691											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1121	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025220	T0	Ativo		2025-10-17 03:00:00	2026-10-16 03:00:00	\N	14505110.97	224058.80	0.00	14281052.17	0.00	INFRAESTRUTURA				E0250259		359.00006224/2025-22									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1122	NADIA BERTUCCELLI	EMPRESA MUNICIPAL DE DESENVOLVIMENTO DE CAMPINAS S/A	SERVI??OS PREFEITURAS	PD251165	T0	Ativo		2025-10-18 03:00:00	2026-10-17 03:00:00	\N	5781547.80	570517.89	0.00	5211029.91	0.00	PREFEITURA - CADASTRO				E0251288		359.00004817/2025-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1184	NADIA BERTUCCELLI	MUNICIPIO DE ITAPOLIS	SERVI??OS PREFEITURAS	PD022551	T3-T4	Ativo		2025-09-15 03:00:00	2026-09-14 03:00:00	\N	82656.00	12099.92	0.00	70556.08	0.00	PREFEITURA CADASTRO				E0220551											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1123	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024344	T01	Ativo		2025-10-18 03:00:00	2026-10-17 03:00:00	\N	1212083.53	18471.52	0.00	1193612.01	0.00	GUIA RH SEFAZ- DATA WAREHOUSE  E PROCESSAMENTO ALTO DESEMPENHO IBM E BI				E0240488											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1124	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024344	T01	Ativo		2025-10-18 03:00:00	2026-10-17 03:00:00	\N	1212083.53	18471.52	0.00	1193612.01	0.00	GUIA RH SEFAZ- DATA WAREHOUSE  E PROCESSAMENTO ALTO DESEMPENHO IBM E BI				E0240489											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1125	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025282	T0	Ativo		2025-10-20 03:00:00	2026-10-19 03:00:00	\N	222134.64	4899.23	0.00	217235.41	0.00	HOSPEDAGEM				E0250340		359.00009462/2025-90									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1126	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025220	T0	Ativo		2025-10-20 03:00:00	2026-10-19 03:00:00	\N	14505110.97	224058.80	0.00	14281052.17	0.00	INFRAESTRUTURA, NUVEM PUBLICA				E0250259											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1127	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD025243	T0	Ativo		2025-10-22 03:00:00	2026-10-21 03:00:00	\N	21063.77	1679.07	0.00	19384.70	0.00	PORTAL PROCON				E0250296		359.00005419/2025-55									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1128	DAIANE DA SILVA SOUZA	MUNICIPIO DE FRANCO DA ROCHA	SERVI??OS PREFEITURAS	PD022559	T03	Ativo		2025-10-22 03:00:00	2026-10-21 03:00:00	\N	991800.00	26623.39	0.00	965176.61	0.00	PREFEITURA CADASTRO				E0220559											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1129	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PIRACAIA	SERVI??OS PREFEITURAS	PD024705	T01	Ativo		2025-10-22 03:00:00	2026-10-21 03:00:00	\N	22408.80	1494.16	0.00	20914.64	0.00	PREFEITURA SIM				E0240705											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1130	AMANDA ESTEVES	COMPANHIA MUNICIPAL DE TRANSITO -CMT	SERVI??OS PREFEITURAS	PD251476	T0	Ativo		2025-10-23 03:00:00	2026-10-22 03:00:00	\N	1138189.32	8691.90	0.00	1129497.42	0.00	PREFEITURA - CADASTRO				E0251591		359.00008830/2025-82									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1131	JUNEIDY SOLANGE BETECA JONY	SECRETARIA MUNICIPAL DA PESSOA COM DEFICIENCIA	SMPED	PD022035	T03	Ativo		2025-02-11 03:00:00	2026-11-10 03:00:00	\N	6016.51	6016.51	0.00	0.00	0.00	PACOTE PORTAL DE ASSINATURA DIGITAL assina.sp F??CIL e PACOTE DE CERTIFICADO DE ATRIBUTO				E0220046		359.00000673/2025-67									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1132	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD022120	T03	Ativo		2025-11-01 03:00:00	2026-10-31 03:00:00	\N	1468548.00	115637.42	0.00	1352910.58	0.00	INTRAGOV				E0220159											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1133	DAIANE DA SILVA SOUZA	MUNICIPIO DE GUARULHOS	SERVI??OS PREFEITURAS	PD022531	T03	Ativo		2025-11-01 03:00:00	2026-10-31 03:00:00	\N	7304418.00	280975.30	0.00	7023442.70	0.00	PREFEITURA CADASTRO				E0220531											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1134	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD023307	T0	Ativo		2023-11-12 03:00:00	2026-11-11 03:00:00	\N	2222446.55	639358.46	0.00	1583088.09	0.00	CERTIFICADO DIGITAL				E0230376		359.00002868/2023-80									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1135	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PDC22073	T02	Ativo		2024-11-14 03:00:00	2026-11-13 03:00:00	\N	626013609.59	192479447.81	0.00	433534161.78	0.00	CONSULTORIA ESPECIALIZADA				EC220098\nEC220100\nEC220173\nEC220275\nEC220344\nEC220345\nEC220353\nEC230177\nEC230328\nED220275\nEF220275		359.00004512/2023-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1136	AMANDA ESTEVES	MUNICIPIO DE PONTAL	SERVI??OS PREFEITURAS	PD251693	T0-T1	Ativo		2025-11-10 03:00:00	2026-11-09 03:00:00	\N	64440.00	0.00	0.00	64440.00	0.00	PREFEITURA CADASTRO				E0251815											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1115	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SANTA RITA D'OESTE	PREFEITURA	PD251211	T0	Ativo	\N	2025-09-30 09:00:00	2026-09-29 09:00:00	\N	30290.88	2524.24	0.00	27766.64	0.00	PLATAFORMA COLABORATIVA I	\N	\N	\N	E0251354	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1137	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD024218	T0	Ativo		2024-11-18 03:00:00	2026-11-17 03:00:00	\N	29589.62	28378.44	0.00	1211.18	0.00	SAM PATRIM??NIO				E0240332		359.0000.3378/2024-81									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1138	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD022413	T02	Ativo		2024-12-02 03:00:00	2026-12-01 03:00:00	\N	32557.49	3076.71	0.00	29480.78	0.00	ARMAZENAMENTO DE DADOS				E0220848		359.00008603/2023-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1139	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD024142	T0	Ativo		2024-12-06 03:00:00	2026-12-05 03:00:00	\N	127443987.64	108542492.07	0.00	18901495.57	0.00	PLATAFORMA COMO SERVI??O PaaS MIDDLEWARE, INFRAESTRUTURA ON PREMISSES, FERRMANETA DE MONITORAMENTO, SERVI??OS HTTP, SERVI??OS T??CNICOS E SUPORTE T??CNICO				E0240240		359.00002595/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1140	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD022450	T01	Ativo		2024-12-07 03:00:00	2026-12-06 03:00:00	\N	9242427.60	3009551.02	0.00	6232876.58	0.00	VPN				E0220893		359.00010250/2024-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1141	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD022291	T02	Ativo		2024-12-08 03:00:00	2026-12-07 03:00:00	\N	93125452.15	47999069.81	0.00	45126382.34	0.00	INFRAESTRUTURA				E0220383		359.00001856/2024-19									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1142	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD022457	T02	Ativo		2024-12-14 03:00:00	2026-12-13 03:00:00	\N	86378.39	20209.54	0.00	66168.85	0.00	FOLHA DE PAGAMENTO				E0220901		359.00010463/2024-04									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1143	LUCIANO PACHECO	SAO PAULO PREVIDENCIA - SPPREV	SPPREV	PD024424	T0	Ativo		2024-12-16 03:00:00	2026-12-15 03:00:00	\N	12304.32	5167.71	0.00	7136.61	0.00	PROGRAMA SP SEM PAPEL				E0240588											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1144	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD022439	T01	Ativo		2024-12-17 03:00:00	2026-12-16 03:00:00	\N	15017.14	2397.27	0.00	12619.87	0.00	PROGRAMA SP SEM PAPEL				E0220880		359.00010376/2024-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1145	ANA LIGIA SAPIENZA COLOMBO	DEFENSORIA PUBLICA DO ESTADO DE SAO PAULO	DEFENSORIA	PD024153	T0	Ativo		2024-06-27 03:00:00	2026-12-26 03:00:00	\N	478249.01	222159.58	0.00	256089.43	0.00	HOSPEDAGEM				E0240254		359.00004432/2024-14									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1146	KARINA FREIRE GRANDA SALLES	ASSEMBLEIA LEGISLATIVA DO ESTADO DE SAO PAULO	ALESP	PDT22603	T0-T1	Ativo		2023-01-02 03:00:00	2027-01-01 03:00:00	\N	8483524.80	1708604.82	0.00	6774919.98	0.00	FOLHA PAGAMENTO				ET220604											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1147	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024373	T0	Ativo		2025-01-03 03:00:00	2027-01-02 03:00:00	\N	18138882.24	2979019.06	0.00	15159863.18	0.00	INFRAESTRUTURA, OPERA????O E  ATENDIMENTO  PARA SEFAZ				E0240524											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1148	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD023353	T0	Ativo		2024-01-26 03:00:00	2027-01-25 03:00:00	\N	28802868.29	16566884.24	0.00	12235984.05	0.00	NUVEM PUBLICA COM SUPORTE AVAN??ADO, CERTIFICADO SSL STANDARD - OV  E  PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0230430											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1149	JUNEIDY SOLANGE BETECA JONY	COLEGIO BANDEIRANTES LTDA	COL. BANDEIRANTES	PD025060	T0	Ativo		2025-05-13 03:00:00	2027-05-12 03:00:00	\N	8160.00	4058.24	0.00	4101.76	0.00	MICROFILMAGEM				E0250073											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1150	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD025001	T0	Ativo		2025-05-15 03:00:00	2027-05-14 03:00:00	\N	147239291.63	64968792.44	0.00	82270499.19	0.00	HIPERAUTOMA????O??				E0250001											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1185	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023390	T0	Ativo		2024-09-16 03:00:00	2026-09-15 03:00:00	\N	6637117.30	2881420.33	0.00	3755696.97	0.00	FOLHA DE PAGAMENTO				E0230475		??359.00000234/2024-73									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1151	FRANCINE TANIGUCHI FALLEIROS DIAS	FUNDACAO CENTRO DE ATENDIMENTO SOCIO-EDUCATIVO AO ADOLESCENTE - FUNDACAO CASA-SP	FUND CASA	PD025036	T0	Ativo		2025-05-15 03:00:00	2027-05-14 03:00:00	\N	62722.50	11168.00	0.00	51554.50	0.00	CERTIFICADO DIGITAL eCPF				E0250045		359.00010960/2024-02									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1152	JUNEIDY SOLANGE BETECA JONY	CAIXA BENEFICENTE DA POLICIA MILITAR DO ESTADO	CBPM	PD024245	T01	Ativo		2025-06-03 03:00:00	2026-06-02 03:00:00	\N	169.94	71.18	0.00	98.76	0.00	PROGRAMA SP SEM PAPEL				E0240374		359.00004147/2024-95									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1153	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE POLITICAS PARA A MULHER	SPM	PD251029	T0	Ativo		2025-05-22 03:00:00	2026-05-21 03:00:00	\N	96730.68	32243.56	0.00	64487.12	0.00	OFFICE				E0251036		359.00004059/2025-74									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1154	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD024454	T0	Ativo		2025-05-27 03:00:00	2026-05-26 03:00:00	\N	8718.24	4359.12	0.00	4359.12	0.00	SAM ESTOQUE e SAM PATRIMONIO				E0241023		359.00010933/2024-21 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1156	LUIS CLAUDINEI DA SILVA	PREFEITURA MUNICIPAL DA ESTANCIA TURISTICA DE RIBEIRAO PIRES	SERVI??OS PREFEITURAS	PD251030	T0	Ativo		2025-05-20 03:00:00	2026-05-19 03:00:00	\N	424080.00	126328.14	0.00	297751.86	0.00	PREFEITURA - CADASTRO				E0251037		359.00002029/2025-23									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1157	NADIA BERTUCCELLI	MUNICIPIO DE ELDORADO	SERVI??OS PREFEITURAS	PD251134	T0	Ativo		2025-05-21 03:00:00	2026-05-20 03:00:00	\N	7732.80	3866.40	0.00	3866.40	0.00	PREFEITURA - CADASTRO				E0251238		359.00003996/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1158	DAIANE DA SILVA SOUZA	MUNICIPIO DE LUIZ ANTONIO	SERVI??OS PREFEITURAS	PD251125	T0	Ativo		2025-05-21 03:00:00	2026-05-20 03:00:00	\N	7732.80	7109.88	0.00	622.92	0.00	PREFEITURA - CADASTRO				E0251222		359.00004835/2025-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1159	DAIANE DA SILVA SOUZA	MUNICIPIO DE PANORAMA	SERVI??OS PREFEITURAS	PD251168	T0	Ativo		2025-05-23 03:00:00	2026-05-22 03:00:00	\N	7732.80	3866.40	0.00	3866.40	0.00	PREFEITURA - CADASTRO				E0251291		359.00004835/2025-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1160	LUCIANO PACHECO	SECRETARIA DE GESTAO E GOVERNO DIGITAL (SOG)	SGGD-SOG	PD024368	T0	Ativo		2025-02-26 03:00:00	2026-05-25 03:00:00	\N	1905.45	989.35	0.00	916.10	0.00	PROGRAMA SP SEM PAPEL				E0240515		359.00008372/2024-09									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1161	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE ESTADUAL PAULISTA JULIO DE MESQUITA FILHO	UNESP	PD024367	T0	Ativo		2025-05-26 03:00:00	2026-05-25 03:00:00	\N	639475.33	11158.40	0.00	628316.93	0.00	NUVEM				E0240514		359.00007175/2024-64									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1162	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITAPIRA	SERVI??OS PREFEITURAS	PD251089	T0	Ativo		2025-05-27 03:00:00	2026-05-26 03:00:00	\N	106812.00	31260.15	0.00	75551.85	0.00	PREFEITURA - SIM				E0251178		359.00003588/2025-51									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1163	LUCIANO PACHECO	SECRETARIA DE GOVERNO E RELACOES INSTITUCIONAIS	SGRI	PD024476	T0	Ativo		2025-05-29 03:00:00	2026-05-28 03:00:00	\N	6563995.20	1864458.73	0.00	4699536.47	0.00	OUTSOURCING				E0241052		359.00009255/2024-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1164	NADIA BERTUCCELLI	MUNICIPIO DE PIRAPORA DO BOM JESUS	SERVI??OS PREFEITURAS	PD251043	T0	Ativo		2025-05-30 03:00:00	2026-05-29 03:00:00	\N	11932.14	11566.98	0.00	365.16	0.00	PREFEITURA - CADASTRO				E0251059		359.00002795/2025-98									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1165	ANA LIGIA SAPIENZA COLOMBO	MINISTERIO PUBLICO DO ESTADO DE SAO PAULO	MP	PD025092	T0	Ativo		2025-06-01 03:00:00	2026-05-31 03:00:00	\N	14295354.07	4898439.52	0.00	9396914.55	0.00	SERVI??O ESPECIALIZADO DE GERENCIAMENTO				E0250107		 359.00000529/2025-21									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1166	NADIA BERTUCCELLI	MUNICIPIO DE BEBEDOURO	SERVI??OS PREFEITURAS	PD251080	T0	Ativo		2025-02-06 03:00:00	2026-06-01 03:00:00	\N	77328.00	24240.18	0.00	53087.82	0.00	PREFEITURA - CADASTRO				E0251164		359.00003503/2025-34									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1167	KARINA FREIRE GRANDA SALLES	SECRETARIA DE DESENVOLVIMENTO ECONOMICO	SDE	PD024171	T01	Ativo		2025-06-05 03:00:00	2026-06-04 03:00:00	\N	2844882.93	1995309.37	0.00	849573.56	0.00	INFRAESTRUTURA				E0240281		359.00003119/2023-70 									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1168	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA ADMINISTRACAO PENITENCIARIA	SAP	PDC22437	T02	Ativo		2025-06-08 03:00:00	2026-06-07 03:00:00	\N	1377671.16	315434.59	0.00	1062236.57	0.00	BI EM NUVEM				E0220877		359.00003012/2025-93									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1169	KARINA FREIRE GRANDA SALLES	INSTITUTO DE MEDICINA SOCIAL E DE CRIMINOLOGIA DE SAO PAULO - IMESC	IMESC	PD024346	T0	Ativo		2025-06-09 03:00:00	2026-06-08 03:00:00	\N	2164179.11	772939.47	0.00	1391239.64	0.00	SUSTENTA????O				E0240492		359.00006658/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1170	DAIANE DA SILVA SOUZA	MUNICIPIO DE BIRIGUI	SERVI??OS PREFEITURAS	PD251120	T0	Ativo		2025-12-06 03:00:00	2026-06-11 03:00:00	\N	128998.08	39333.42	0.00	89664.66	0.00	PREFEITURA - CADASTRO				E0251216		359.00003827/2025-72									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1171	DAIANE DA SILVA SOUZA	MUNICIPIO DE ADAMANTINA	SERVI??OS PREFEITURAS	PD024700	T01	Ativo		2025-10-18 03:00:00	2027-10-17 03:00:00	\N	67226.40	681.94	0.00	66544.46	0.00	PREFEITURA SIM				E0240700											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1172	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD024244	T01	Ativo		2025-10-18 03:00:00	2027-10-17 03:00:00	\N	167080.61	6965.06	0.00	160115.55	0.00	PROGRAMA SP SEM PAPEL				E0240373											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1175	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD024038	T01	Ativo		2025-05-22 03:00:00	2026-05-21 03:00:00	\N	1036.70	493.26	0.00	543.44	0.00	PROGRAMA SP SEM PAPEL				E0240050		359.00001980/2024-84									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1176	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PIRAPOZINHO	SERVI??OS PREFEITURAS	PD251497	T0	Ativo		2025-12-09 03:00:00	2026-09-11 03:00:00	\N	51552.00	3533.46	0.00	48018.54	0.00	PREFEITURA - CADASTRO				E0251610		359.00008903/2025-36									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1177	NADIA BERTUCCELLI	MUNICIPIO DE SANTANA DE PARNAIBA	SERVI??OS PREFEITURAS	PD022572	T04	Ativo		2025-09-12 03:00:00	2026-09-11 03:00:00	\N	1445760.00	150226.04	0.00	1295533.96	0.00	PREFEITURA CADASTRO				E0220572											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1178	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD024205	T0	Ativo		2024-09-13 03:00:00	2026-09-12 03:00:00	\N	18416981.52	8178776.57	0.00	10238204.95	0.00	DESENVOLVIMENTO DE SISTEMAS				E0240320		359.00002903/2024-41									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1179	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE PIRASSUNUNGA	SERVI??OS PREFEITURAS	PD251282	T0	Ativo		2025-09-13 03:00:00	2026-09-12 03:00:00	\N	77328.00	12888.00	0.00	64440.00	0.00	PREFEITURA - CADASTRO				E0251386		359.00006240/2025-15									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1180	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD024323	T01	Ativo		2025-09-13 03:00:00	2026-09-12 03:00:00	\N	291.97	35.33	0.00	256.64	0.00	PROGRAMA SP SEM PAPEL				E0240466											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1181	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025276	T00	Ativo		2025-09-14 03:00:00	2026-09-13 03:00:00	\N	156016.80	18201.96	0.00	137814.84	0.00	NUVEM				E0250334		359.00008595.2025-49									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1182	CLEIA APARECIDA DA SILVA	PROCURADORIA GERAL DO ESTADO	PGE	PD025277	T00	Ativo		2025-09-14 03:00:00	2026-09-13 03:00:00	\N	1487201.37	149462.13	0.00	1337739.24	0.00	INFRAESTRUTURA				E0250335		359.00008609/2025-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1183	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE VIRTUAL DO ESTADO DE SAO PAULO - UNIVESP	UNIVESP	PD024291	T01	Ativo		2025-09-14 03:00:00	2026-09-13 03:00:00	\N	7116.62	770.99	0.00	6345.63	0.00	SAM ESTOQUE				E0240428											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1186	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD022161	T03	Ativo		2025-09-16 03:00:00	2026-09-15 03:00:00	\N	103056.00	7943.90	0.00	95112.10	0.00	GESTAO INTRAGOV				E0220208											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1187	DAIANE DA SILVA SOUZA	MUNICIPIO DE BANANAL	SERVI??OS PREFEITURAS	PD024693	T01	Ativo		2025-09-18 03:00:00	2026-09-17 03:00:00	\N	8150.40	1358.40	0.00	6792.00	0.00	PREFEITURA CADASTRO				E0240693											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1188	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD024242	T01	Ativo		2025-09-18 03:00:00	2026-09-17 03:00:00	\N	18060.00	924.64	0.00	17135.36	0.00	PROGRAMA SP SEM PAPEL				E0240370											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1189	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO MEMORIAL DA AMERICA LATINA	MEMORIAL	PD251201	T00	Ativo		2025-09-19 03:00:00	2026-09-18 03:00:00	\N	6412.34	698.06	0.00	5714.28	0.00	OFFICE				E0240475		359.00006226/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1190	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO MEMORIAL DA AMERICA LATINA	MEMORIAL	PD023130	T02	Ativo		2025-09-19 03:00:00	2026-09-18 03:00:00	\N	987.54	58.12	0.00	929.42	0.00	PROGRAMA SP SEM PAPEL				E0230153											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1191	NADIA BERTUCCELLI	MUNICIPIO DE CAJATI	SERVI??OS PREFEITURAS	PD022544	T03	Ativo		2025-09-19 03:00:00	2026-09-18 03:00:00	\N	20664.00	1733.48	0.00	18930.52	0.00	PREFEITURA CADASTRO				E0220544											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1192	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAPELA DO ALTO	SERVI??OS PREFEITURAS	PD022552	T03	Ativo		2025-09-19 03:00:00	2026-09-18 03:00:00	\N	41115.60	1229.19	0.00	39886.41	0.00	PREFEITURA SIM				E0220552											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1193	CLEIA APARECIDA DA SILVA	SECRETARIA DE AGRICULTURA E ABASTECIMENTO	SAA	PD023172	T02	Ativo		2025-09-21 03:00:00	2026-09-20 03:00:00	\N	40790.40	2436.18	0.00	38354.22	0.00	PROGRAMA SP SEM PAPEL				E0230200											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1194	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE ITAPEVA	SERVI??OS PREFEITURAS	PD021730	T04	Ativo		2025-09-21 03:00:00	2026-09-20 03:00:00	\N	343560.00	36395.30	0.00	307164.70	0.00	PREFEITURA CADASTRO				E0210730											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1195	NADIA BERTUCCELLI	MUNICIPIO DE MATAO	SERVI??OS PREFEITURAS	PD023675	T02	Ativo		2025-09-21 03:00:00	2026-09-20 03:00:00	\N	89544.00	1492.40	0.00	88051.60	0.00	PREFEITURA CADASTRO				E0230675											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1196	FRANCINE TANIGUCHI FALLEIROS DIAS	POLICIA MILITAR DO ESTADO DE SAO PAULO	PM	PD023112	T02	Ativo		2025-09-22 03:00:00	2026-09-21 03:00:00	\N	245874.24	3596.81	0.00	242277.43	0.00	NUVEM P??BLICA				E0230131											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1197	AMANDA ESTEVES	MUNICIPIO DE ITATIBA	SERVI??OS PREFEITURAS	PD021736	T04	Ativo		2025-09-22 03:00:00	2026-09-21 03:00:00	\N	321336.00	12859.92	0.00	308476.08	0.00	PREFEITURA CADASTRO				E0210736											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1198	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO SEBASTIAO	SERVI??OS PREFEITURAS	PD022563	T05	Ativo		2025-09-22 03:00:00	2026-09-21 03:00:00	\N	872160.00	129815.44	0.00	742344.56	0.00	PREFEITURA CADASTRO				E0220563											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1199	DAIANE DA SILVA SOUZA	MUNICIPIO DE DIADEMA	SERVI??OS PREFEITURAS	PD023676	T03	Ativo		2025-09-23 03:00:00	2026-09-22 03:00:00	\N	3029760.00	545154.20	0.00	2484605.80	0.00	PREFEITURA CADASTRO				E0230676											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1200	NADIA BERTUCCELLI	MUNICIPIO DE AMERICANA	SERVI??OS PREFEITURAS	PD024681	T01	Ativo		2025-09-23 03:00:00	2026-09-22 03:00:00	\N	1071847.41	170053.49	0.00	901793.92	0.00	PREFEITURA CADASTRO				E0240681											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1201	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD022150	T04	Ativo		2025-09-26 03:00:00	2026-09-25 03:00:00	\N	3996676.82	36536.72	0.00	3960140.10	0.00	INFRAESTRUTURA VIRTUALIZADA ON PREMISES E PAAS MIDDLEWARE				E0220194											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1202	LUCIANO PACHECO	CODERP CIA DE DESENVOLVIMENTO ECONOMICO DE RIB PRETO	CODERP	PD251306	T0	Ativo		2025-09-26 03:00:00	2026-09-25 03:00:00	\N	1256400.00	24430.00	0.00	1231970.00	0.00	PLATAFORMA DE COLABORA????O E PRODUTIVIDADE - BASICO				E0251413											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1203	DAIANE DA SILVA SOUZA	MUNICIPIO DE CAIEIRAS	SERVI??OS PREFEITURAS	PD024651	T01	Ativo		2025-09-26 03:00:00	2026-09-25 03:00:00	\N	135840.00	9089.96	0.00	126750.04	0.00	PREFEITURA CADASTRO				E0240651											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1204	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD024225	T01	Ativo		2025-09-20 03:00:00	2026-09-19 03:00:00	\N	1322257.60	151695.75	0.00	1170561.85	0.00	MANUTEN????O DO SISTEMA  PARA  SPI				E0240342											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1205	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD021340	T05	Ativo		2025-09-27 03:00:00	2026-09-26 03:00:00	\N	10258.08	854.84	0.00	9403.24	0.00	SAM ESTOQUE				E0210445											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1206	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE CONTAS DO ESTADO	TCE	PD022351	T02	Ativo		2025-07-01 03:00:00	2026-09-30 03:00:00	\N	1009086.45	180393.81	0.00	828692.64	0.00	FOLHA DE PAGAMENTO				E0220458		359.00002845/2024-56??									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1207	NADIA BERTUCCELLI	MUNICIPIO DE ATIBAIA	SERVI??OS PREFEITURAS	PD251469	T0-T1	Ativo		2025-10-02 03:00:00	2026-10-01 03:00:00	\N	1675189.32	103486.75	0.00	1571702.57	0.00	PREFEITURA - CADASTRO				E0251600		359.00008851/2025-06									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1208	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE CAPAO BONITO	SERVI??OS PREFEITURAS	PD024694	T01	Ativo		2025-10-02 03:00:00	2026-10-01 03:00:00	\N	67560.00	957.10	0.00	66602.90	0.00	PREFEITURA CADASTRO				E0240694											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1209	MARIA REGINA FUNICELLO	IMPRENSA OFICIAL DO ESTADO DO RIO DE JANEIRO	IOERJ	PD025180	T0	Ativo		2025-10-03 03:00:00	2026-10-02 03:00:00	\N	641804.75	7920.64	0.00	633884.11	0.00	CERTIFICADOS AR				E0250208											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1210	BARBARA ALMEIDA TUNES FERNANDES	CORPO DE BOMBEIROS DA POLICIA MILITAR DO ESTADO DE SAO PAULO	BOMBEIROS	PD022475	T02	Ativo		2025-10-03 03:00:00	2026-10-02 03:00:00	\N	5244986.70	388192.93	0.00	4856793.77	0.00	IAAS AVAN??ADA - PAAS - SMTP - CERTIFICADO SSL STANDAR - OV				E0220919											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1211	BARBARA ALMEIDA TUNES FERNANDES	CORPO DE BOMBEIROS DA POLICIA MILITAR DO ESTADO DE SAO PAULO	BOMBEIROS	PD022475	T02	Ativo		2025-10-03 03:00:00	2026-10-02 03:00:00	\N	5244986.70	388192.93	0.00	4856793.77	0.00	MANUTEN????O SISTEMA SGSCI - VIA FACIL - BOMBEIROS				E0220921											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1212	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD024037	T01	Ativo		2025-10-03 03:00:00	2026-10-02 03:00:00	\N	846.54	141.08	0.00	705.46	0.00	PROGRAMA SP SEM PAPEL				E0240049											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1213	DAIANE DA SILVA SOUZA	MUNICIPIO DE OSASCO	SERVI??OS PREFEITURAS	PD022553	T03	Ativo		2025-10-03 03:00:00	2026-10-02 03:00:00	\N	2652408.00	174560.04	0.00	2477847.96	0.00	PREFEITURA CADASTRO				E0220553											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1214	ANA LIGIA SAPIENZA COLOMBO	SAO PAULO TRIBUNAL DE JUSTICA	TJ	PD021141	T05	Ativo		2025-10-04 03:00:00	2026-10-03 03:00:00	\N	10466284.99	553601.55	0.00	9912683.44	0.00	FOLHA DE PAGAMENTO				E0210174											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1215	AMANDA ESTEVES	MUNICIPIO DE JANDIRA	SERVI??OS PREFEITURAS	PD251468	T0	Ativo		2025-10-07 03:00:00	2026-10-06 03:00:00	\N	246960.00	1815.06	0.00	245144.94	0.00	PREFEITURA - CADASTRO				E0251580		359.00008824/2025-25									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1216	AMANDA ESTEVES	MUNICIPIO DE PORANGABA	SERVI??OS PREFEITURAS	PD251275	T0	Ativo		2025-10-08 03:00:00	2026-10-07 03:00:00	\N	7732.80	644.40	0.00	7088.40	0.00	PREFEITURA - CADASTRO				E0251375		359.00006145/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1217	JUNEIDY SOLANGE BETECA JONY	FUNDACAO INSTITUTO DE TERRAS DO ESTADO DE SAO PAULO JOSE GOMES DA SILVA	ITESP	PD024163	T01	Ativo		2025-10-08 03:00:00	2026-10-07 03:00:00	\N	3271.03	209.45	0.00	3061.58	0.00	PROGRAMA SP SEM PAPEL				E0240271											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1218	NADIA BERTUCCELLI	FUNDO MUNICIPAL DE TRANSITO - FUMTRAN	SERVI??OS PREFEITURAS	PD251594	T0	Ativo		2025-10-09 03:00:00	2026-10-08 03:00:00	\N	45108.00	472.56	0.00	44635.44	0.00	PREFEITURA - CADASTRO				E0251709		 359.00009444/2025-16\n359.00009738/2025-30									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1219	BARBARA ALMEIDA TUNES FERNANDES	CETESB COMPANHIA AMBIENTAL DO ESTADO DE SAO PAULO	CETESB	PD022239	T02	Ativo		2025-10-09 03:00:00	2026-10-08 03:00:00	\N	33.23	1.96	0.00	31.27	0.00	PROGRAMA SP SEM PAPEL				E0220313											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1220	DAIANE DA SILVA SOUZA	MUNICIPIO DE SAO PEDRO	SERVI??OS PREFEITURAS	PD251434	T0	Ativo		2025-10-14 03:00:00	2026-10-13 03:00:00	\N	10681.20	569.97	0.00	10111.23	0.00	PREFEITURA - SIM				E0251542		359.00008441/2025-57									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1221	DAIANE DA SILVA SOUZA	MUNICIPIO DE SALTO	SERVI??OS PREFEITURAS	PD251437	T0	Ativo		2025-10-15 03:00:00	2026-10-14 03:00:00	\N	187920.00	644.40	0.00	187275.60	0.00	PREFEITURA - CADASTRO				E0251546		359.00008445/2025-35									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1222	MARIA REGINA FUNICELLO	JUNTA COMERCIAL DO ESTADO DE SAO PAULO	JUCESP	PD023324	T02	Ativo		2025-10-16 03:00:00	2026-10-15 03:00:00	\N	850545.05	35267.08	0.00	815277.97	0.00	NUVEM P??BLICA E MIDDLEWARE				E0230395											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1223	NADIA BERTUCCELLI	EMP MUNIC DESENVOL URBANO RURAL DE BAURU	SERVI??OS PREFEITURAS	PD251160	T0	Ativo		2025-10-23 03:00:00	2026-10-22 03:00:00	\N	789139.32	100433.25	0.00	688706.07	0.00	PREFEITURA - CADASTRO				E0251277		359.00004679/2025-11									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1224	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO MEMORIAL DA AMERICA LATINA	MEMORIAL	PD251201	T0	Ativo		2025-10-23 03:00:00	2026-10-22 03:00:00	\N	6412.34	698.06	0.00	5714.28	0.00	PLATAFORMA COLABORATIVA I				E0251348											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1225	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE JUQUIA	SERVI??OS PREFEITURAS	PD022556	T04	Ativo		2025-10-24 03:00:00	2026-10-23 03:00:00	\N	86550.00	6762.44	0.00	79787.56	0.00	PREFEITURA CADASTRO				E0220556											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1226	DAIANE DA SILVA SOUZA	MUNICIPIO DE IRACEMAPOLIS	SERVI??OS PREFEITURAS	PD022583	T03	Ativo		2025-10-24 03:00:00	2026-10-23 03:00:00	\N	20772.00	1523.28	0.00	19248.72	0.00	PREFEITURA CADASTRO				E0220583											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1227	NADIA BERTUCCELLI	EMPRESA MUNICIPAL DE MOBILIDADE URBANA DE MARILIA - EMDURB	SERVI??OS PREFEITURAS	PD251656	T0	Ativo		2025-10-27 03:00:00	2026-10-26 03:00:00	\N	923389.32	7097.67	0.00	916291.65	0.00	PREFEITURA - CADASTRO				E0251770		359.00010697/2025-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1228	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD024250	T01	Ativo		2025-09-27 03:00:00	2026-09-26 03:00:00	\N	4565807.52	179093.85	0.00	4386713.67	0.00	NUVEM PRODESP				E0240379											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1230	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD020096	T04	Ativo		2025-10-15 03:00:00	2026-10-14 03:00:00	\N	8003.40	666.95	0.00	7336.45	0.00	SAM ESTOQUE				E0200112											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1231	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE BOITUVA	SERVI??OS PREFEITURAS	PD251032	T0	Ativo		2025-10-30 03:00:00	2026-10-29 03:00:00	\N	223344.00	21662.40	0.00	201681.60	0.00	PREFEITURA - CADASTRO				E0251039		359.00002604/2025-98									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1232	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD024212	T0	Ativo		2024-08-05 03:00:00	2027-02-04 03:00:00	\N	35849.83	21532.76	0.00	14317.07	0.00	PROGRAMA SP SEM PAPEL				E0240328											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1233	MARTA MARIA NOVAES DE ALC??NTARA	COMPANHIA PAULISTA DE TRENS METROPOLITANOS CPTM	CPTM	PD024442	T0	Ativo		2025-02-12 03:00:00	2027-02-11 03:00:00	\N	105314.30	5531.73	0.00	99782.57	0.00	CERTIFICADO DIGITAL				E0241009											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1234	KARINA FREIRE GRANDA SALLES	INSTITUTO DE PESQUISAS TECNOLOGICAS DO ESTADO DE SAO PAULO - IPT	IPT	PD022465	T01	Ativo		2025-02-15 03:00:00	2027-02-14 03:00:00	\N	12344.28	1271.21	0.00	11073.07	0.00	PROGRAMA SP SEM PAPEL				E0220909											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1235	FRANCINE TANIGUCHI FALLEIROS DIAS	SECRETARIA DE ESTADO DA SAUDE	SES	PD023409	T0	Ativo		2025-03-06 03:00:00	2027-03-05 03:00:00	\N	19981463.13	4411263.24	0.00	15570199.89	0.00	DESENVOLVIMENTO, MANUTEN????O,NUVEM P??BLICA, RECURSOS ADICIONAIS E FERRAMENTA DE APLICA????ES				E0230504											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1236	MARTA MARIA NOVAES DE ALC??NTARA	CIA DO METROPOLITANO DE SAO PAULO	METR??	PD024095	T0	Ativo		2024-09-12 03:00:00	2027-03-11 03:00:00	\N	149514.19	63806.95	0.00	85707.24	0.00	CERTIFICADO DIGITAL E-CPF - E CNPJ.				E0240144											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1237	MARTA MARIA NOVAES DE ALC??NTARA	CIA DO METROPOLITANO DE SAO PAULO	METR??	PD023020	T01	Ativo		2025-03-23 03:00:00	2027-03-22 03:00:00	\N	53419.98	453.14	0.00	52966.84	0.00	PROGRAMA SP SEM PAPEL				E0230025											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1238	FRANCINE TANIGUCHI FALLEIROS DIAS	SAO PAULO SECRETARIA DA SEGURANCA PUBLICA	SSP	PD025024	T0	Ativo		2025-03-25 03:00:00	2027-03-24 03:00:00	\N	8718.24	2542.82	0.00	6175.42	0.00	SAM ESTOQUE - PATRIMONIO				E0250029											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1239	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD024457	T0	Ativo		2025-03-26 03:00:00	2027-03-25 03:00:00	\N	70168086.72	7773544.07	0.00	62394542.65	0.00	INFRAESTRUTURA DO SEI CIDADES				E0241027											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1240	MARTA MARIA NOVAES DE ALC??NTARA	CENTRO ESTADUAL DE EDUCACAO TECNOLOGICA PAULA SOUZA	CPS	PD022496	T01	Ativo		2025-03-29 03:00:00	2027-03-28 03:00:00	\N	117802.42	6343.68	0.00	111458.74	0.00	CERTIFICADO DIGITAL eCPF,  eCNPJ  E CERTIFICADO SSL WILDCARD				E0220947											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1241	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024014	T0	Ativo		2024-04-01 03:00:00	2027-03-31 03:00:00	\N	658722.86	184098.10	0.00	474624.76	0.00	CERTIFICADO SSL WILDCARD, SSL CODE SIGNING E SSL ICP-BRASIL,				E0240018											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1242	MARTA MARIA NOVAES DE ALC??NTARA	SAO PAULO SECRETARIA DA EDUCACAO	SEDUC	PD024010	T0	Ativo		2024-04-22 03:00:00	2027-04-21 03:00:00	\N	41809071.42	27376424.66	0.00	14432646.76	0.00	PAAS MIDDLEWARE COM SERVI??O DE GEST??O				E0240010											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1243	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD024337	T0	Ativo		2024-08-26 03:00:00	2027-04-25 03:00:00	\N	167189187.92	52074181.60	0.00	115115006.32	0.00	DISPONIBILIZA????O DA PLATAFORMA MONITORASP - DER/SP.				E0240481											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1244	JUNEIDY SOLANGE BETECA JONY	COMPANHIA DE PROCESSAMENTO DE DADOS DA PARAIBA CODATA	CODATA	PD024081	T0	Ativo		2024-05-09 03:00:00	2027-05-08 03:00:00	\N	34953570.03	928688.85	0.00	34024881.18	0.00	OFFICE  B??SICO - INTERMEDI??RIO				E0240126											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1245	MARIA REGINA FUNICELLO	SECRETARIA DA FAZENDA E PLANEJAMENTO	SEFAZ	PD024110	T0	Ativo		2024-05-28 03:00:00	2027-05-27 03:00:00	\N	57206670.15	26314831.29	0.00	30891838.86	0.00	OFFICE INTERMEDI??RIO E PaaS MIDDLEWARE COMO SERVI??OS DE GEST??O				E0240161											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1246	RODRIGO BORGHESE TAMBASCO	DESENVOLVE SP - AGENCIA DE FOMENTO DO ESTADO DE SAO PAULO S.A.	DESENVOLVE SP	PD024172	T0	Ativo		2024-05-29 03:00:00	2027-05-28 03:00:00	\N	83779531.93	31390731.86	0.00	52388800.07	0.00	PROJETO TRANSFORMA????O DIGITAL  - DESENVOLVIMENTO/ SUSTENTA????O DE APLICA????ES				E0240282											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1247	JUNEIDY SOLANGE BETECA JONY	UNIVERSIDADE DE SAO PAULO	USP	PD022062	T01	Ativo		2024-11-30 03:00:00	2027-05-30 03:00:00	\N	65123.35	2204.31	0.00	62919.04	0.00	CERTIFICADO DIGITAL				E0220085											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1248	JUNEIDY SOLANGE BETECA JONY	TRILOGIC TECNOLOGIA LTDA	TRILOGIC	PD025231		Ativo		2025-06-26 03:00:00	2027-06-25 03:00:00	\N	2160.00	39.33	0.00	2120.67	0.00	CARIMBO TEMPO				E0250274											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1249	RODRIGO BORGHESE TAMBASCO	SECRETARIA DE GESTAO E GOVERNO DIGITAL	SGGD	PD251129		Ativo		2025-06-30 03:00:00	2027-06-29 03:00:00	\N	7630661.31	1308090.01	0.00	6322571.30	0.00	PLATAFORMA COLABORATIVA I				E0251228											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1250	RODRIGO BORGHESE TAMBASCO	DEPARTAMENTO DE ESTRADAS DE RODAGEM	DER	PD251204		Ativo		2025-07-12 03:00:00	2027-07-11 03:00:00	\N	6053102.40	895823.80	0.00	5157278.60	0.00	PLATAFORMA COLABORATIVA				E0251352											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1251	JUNEIDY SOLANGE BETECA JONY	BRASIL IOT SEG. DA INFORMACAO LTDA	BRASIL IOT	PD251325	T0	Ativo		2025-07-30 03:00:00	2027-07-29 03:00:00	\N	14400.00	0.18	0.00	14399.82	0.00	CARIMBO DE TEMPO				E0251432											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1252	JUNEIDY SOLANGE BETECA JONY	INCLOUD TECNOLOGIA E SERVICOS LTDA	DOCKTEKA	PD025116		Ativo		2025-08-05 03:00:00	2027-08-04 03:00:00	\N	36000.00	156.96	0.00	35843.04	0.00	CARIMBO DE TEMPO				E0250134											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1253	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD024154	T0	Ativo		2025-02-19 03:00:00	2027-08-18 03:00:00	\N	700206.07	98372.87	0.00	601833.20	0.00	OUTSOURCING - PAAS MIDDLEWARE				E0240255											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1254	MARTA MARIA NOVAES DE ALC??NTARA	FUNDACAO P/ DESENVOLVIMENTO DA EDUCACAO	FDE	PD025199	T0	Ativo		2025-08-22 03:00:00	2027-08-21 03:00:00	\N	1826366.40	228295.80	0.00	1598070.60	0.00	PaaS MIDDLEWARE				E0250232											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1255	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE MARILIA	FAMEMA	PD251153	T0	Ativo		2025-09-05 03:00:00	2027-09-04 03:00:00	\N	68967.36	5747.28	0.00	63220.08	0.00	EMAIL COMO SERVI??O E OFFICE B??SICO				E0251265		359.00004611/2025-24									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1256	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS DIREITOS DA PESSOA COM DEFICIENCIA	SEDPcD	PD023147	T02	Ativo		2025-03-25 03:00:00	2027-03-24 03:00:00	\N	2691989.50	701873.59	0.00	1990115.91	0.00	DESENVOLVIMENTO/IMPLANTA????O, SUSTENTA????O DO SISTEMA CIPTEA				E0230172											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1257	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE ESTADO DOS TRANSPORTES METROPOLITANOS	STM	PD251272	T0	Ativo		2025-09-08 03:00:00	2027-09-07 03:00:00	\N	462687.60	36629.44	0.00	426058.16	0.00	OFFICE B??SICO				E0251372		359.00006356/2025-54									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1258	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD024075	T0	Ativo		2024-06-04 03:00:00	2027-06-03 03:00:00	\N	11246362.57	5090846.41	0.00	6155516.16	0.00	MANUTEN????O DO SISTEMA DE APOIO AS FISCALIZA????ES - SIAFI				E0240110											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1259	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD251133	T0	Ativo		2025-09-13 03:00:00	2027-09-12 03:00:00	\N	10633.68	886.14	0.00	9747.54	0.00	E-MAIL COMO SERVI??O				E0251237		359.00003982/2025-99									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1260	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SAO MIGUEL ARCANJO	SERVI??OS PREFEITURAS	PD024688	T01	Ativo		2025-09-18 03:00:00	2027-09-17 03:00:00	\N	40752.00	3101.68	0.00	37650.32	0.00	PREFEITURA CADASTRO				E0240688											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1261	DAIANE DA SILVA SOUZA	MUNICIPIO DE JARDINOPOLIS	SERVI??OS PREFEITURAS	PD023662	T02	Ativo		2025-10-01 03:00:00	2027-09-30 03:00:00	\N	110784.00	1384.80	0.00	109399.20	0.00	PREFEITURA CADASTRO				E0230662											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1262	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE MAUA	SERVI??OS PREFEITURAS	PD023677	T02	Ativo		2025-10-01 03:00:00	2027-09-30 03:00:00	\N	6835680.00	458702.91	0.00	6376977.09	0.00	PREFEITURA CADASTRO				E0230677											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1263	AMANDA ESTEVES	MUNICIPIO DE SAO LUIZ DO PARAITINGA	SERVI??OS PREFEITURAS	PD024697	T01	Ativo		2025-10-02 03:00:00	2027-10-01 03:00:00	\N	13512.00	1553.88	0.00	11958.12	0.00	PREFEITURA CADASTRO				E0240697											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1264	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SANTA ISABEL	SERVI??OS PREFEITURAS	PD024701	T01	Ativo		2025-10-03 03:00:00	2027-10-02 03:00:00	\N	517920.00	14201.20	0.00	503718.80	0.00	PREFEITURA CADASTRO				E0240701											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1265	FRANCINE TANIGUCHI FALLEIROS DIAS	SUPERINTENDENCIA DA POLICIA TECNICO-CIENTIFICA	SPTC	PD024317	T0	Ativo		2024-10-04 03:00:00	2027-10-03 03:00:00	\N	331975.00	140019.94	0.00	191955.06	0.00	CERTIFICADO DIGITAL eCPF				E0240458											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1266	LUCIANO PACHECO	SECRETARIA DE COMUNICACAO	SECOM	PD251521	T0	Ativo		2025-10-07 03:00:00	2027-10-06 03:00:00	\N	63172.80	2105.76	0.00	61067.04	0.00	PLATAFORMA COLABORATIVA II				E0251638											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1267	LUIS CLAUDINEI DA SILVA	MUNICIPIO DE SARAPUI	SERVI??OS PREFEITURAS	PD024686	T01	Ativo		2025-10-16 03:00:00	2027-10-15 03:00:00	\N	8107.20	675.60	0.00	7431.60	0.00	PREFEITURA CADASTRO				E0240686											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1268	NADIA BERTUCCELLI	MUNICIPIO DE BARRA BONITA	SERVI??OS PREFEITURAS	PD024703	T01	Ativo		2025-10-16 03:00:00	2027-10-15 03:00:00	\N	40536.00	1035.92	0.00	39500.08	0.00	PREFEITURA CADASTRO				E0240703											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1269	AMANDA ESTEVES	MUNICIPIO DE MIRACATU	SERVI??OS PREFEITURAS	PD023678	T03	Ativo		2025-10-20 03:00:00	2027-10-19 03:00:00	\N	20772.00	692.40	0.00	20079.60	0.00	PREFEITURA CADASTRO				E0230678											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1270	BARBARA ALMEIDA TUNES FERNANDES	FUNDACAO CONSERV PROD FLORESTAL EST SP	FUND. FLORESTAL	PD251264	T0	Ativo		2025-10-20 03:00:00	2027-10-19 03:00:00	\N	423302.40	6467.12	0.00	416835.28	0.00	PLATAFORMA COLABORATIVA I				E0251366											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1271	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD0251198	T0	Ativo		2025-10-22 03:00:00	2027-10-21 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	SAM PATRIMONIO				E0251345											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1272	BARBARA ALMEIDA TUNES FERNANDES	FACULDADE DE MEDICINA DE SAO JOSE DO RIO PRETO	FAMERP	PD251198	T0	Ativo		2025-10-22 03:00:00	2027-10-21 03:00:00	\N	3936.96	49.22	0.00	3887.74	0.00	SAM PATRIMONIO				E0251345											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1273	KARINA FREIRE GRANDA SALLES	AGENCIA METROPOLITANA DE SOROCABA - AGEMSOROCABA	AGEMSOROCABA	PD024351	T01	Ativo		2025-10-23 03:00:00	2027-10-22 03:00:00	\N	15581.28	65.24	0.00	15516.04	0.00	FOLHA DE PAGAMENTO				E0240497											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1274	JUNEIDY SOLANGE BETECA JONY	SECRETARIA DE PARCERIAS EM INVESTIMENTOS	SPI	PD251122	T0	Ativo		2025-09-14 03:00:00	2027-09-13 03:00:00	\N	762432.00	63536.00	0.00	698896.00	0.00	OFFICE BASICO - EMAIL COMO SERVI??O				E0251219		359.00006933/2024-27									2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1275	CLEIA APARECIDA DA SILVA	AGENCIA REGULADORA DE SERVICOS PUBLICOS DO ESTADO DE SAO PAULO - ARSESP	ARSESP	PD024310	T0	Ativo		2024-09-17 03:00:00	2027-09-16 03:00:00	\N	4160030.88	996043.18	0.00	3163987.70	0.00	NUVEM PRODESP - HOSPEDAGEM - INFRAESTRUTURA VIRTUALIZADA ON PREMISES				E0240449											2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
906	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD019035	T05	Expirado	\N	2025-07-04 03:00:00	2025-11-03 03:00:00	\N	2327288.46	1841461.27	0.00	485827.19	0.00	ATENDIMENTO E SUPORTE AO USUARIO DE TIC, SERVICOS TECNICOS ESPECIALIZADOS, GESTAO DE FIREWALL E GESTAO DE PROXY	\N	\N	\N	E0190047	Assinado	359.00008385/2023-99	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
918	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023050	T01	Ativo	\N	2025-04-01 03:00:00	2026-03-31 03:00:00	\N	6396.00	3478.17	0.00	2917.83	0.00	PROGRAMA SP SEM PAPEL	RENOVA????O	\N	7. Aguardando "De Acordo" do Cliente (75 a 65)	E0230059	Assinado	359.00003830/2024-13	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
97	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD022429	T02	Encerrado	\N	2025-01-30 03:00:00	2025-11-04 03:00:00	\N	8028479.28	6865326.70	0.00	1163152.58	0.00	SUSTENTA????O DOS SISTEMAS SANCIONAT??RIO. ATENDIMENTO. FINANCEIRO E GEST??O DRI	CANCELAMENTO	\N	\N	E0220866	Contrato rescindido com data fim 04/11/2025	359.00001181/2024-16  	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-15 14:41:31.993
248	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD019206	T04	Renovado	\N	2024-01-01 03:00:00	2025-03-31 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PROCESSAMENTO DE FOLHA DE PAGAMENTO DESCENTRALIZADA	RENOVA????O	\N	15. Finalizado (0)	E0190265	Assinado (Renovado no PD025126 )	359.00001320/2024-01	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
216	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD019247	T04	Encerrado	\N	2024-02-03 03:00:00	2025-02-02 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	MANUTEN????O DE SISTEMAS	\N	\N	\N	E0190315	Contrato Encerrado	359.00000842/2024-88	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
963	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD201003	T01	Renovado	\N	2025-06-17 03:00:00	2025-12-16 03:00:00	\N	1963147.68	1280539.69	0.00	682607.99	0.00	GED	\N	\N	\N	E0201003	Assinado	359.00004833/2025-47	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
307	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023330	T02	Encerrado	\N	2025-03-01 03:00:00	2025-06-30 03:00:00	\N	0.00	0.00	0.00	0.00	0.00	PAAS MIDDLEWARE COM SERVICO DE GESTAO	\N	\N	\N	E0230401	30/06 - Ser?? aditado no contrato de nuvem PD024011	359.00008371/2023-75	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
970	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD023064	T04	Ativo	\N	2026-01-26 03:00:00	2026-04-25 03:00:00	\N	62430.00	3452.46	0.00	58977.54	0.00	DECBENS - SISTEMA DE DECLARA????O DE BENS	\N	\N	\N	E0230073	Assinado	359.00003065/2023-42	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
565	PAULO MARCELLO DA SILVA FERREIRA	INSTITUTO DE ASSISTENCIA MEDICA AO SERVIDOR PUBLICO ESTADUAL	IAMSPE	PD019035	T06	Expirado	\N	2025-07-04 03:00:00	2025-11-03 03:00:00	\N	2327288.46	1841461.27	0.00	485827.19	0.00	HELP DESK	\N	\N	\N	E0190047	Assinado	359.00008385/2023-99	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
539	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD020121	T03	Ativo	\N	2025-05-01 03:00:00	2026-04-30 03:00:00	\N	338806.53	62475.12	0.00	276331.41	0.00	NUVEM PRODESP, PaaS, MONITORAMENTO, OUTSOURCING	\N	\N	\N	E0200143	Assinado	359.00002466/2023-85	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1061	PAULO MARCELLO DA SILVA FERREIRA	FUNDACAO DE PROTECAO E DEFESA DO CONSUMIDOR	PROCON	PD020268	T04	Renovado	\N	2024-12-01 03:00:00	2025-11-30 03:00:00	\N	36390.00	21749.09	0.00	14640.91	0.00	SERVI??O DE REDE PRIVADA VIRTUAL - VPN	\N	\N	\N	E0200348	Assinado	359.00009736/2023-89	\N	\N	\N	\N	\N	PD2513113 	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
44	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE CUBATAO	PREFEITURA	PD251064	T0	Ativo	\N	2025-06-22 09:00:00	2026-06-21 09:00:00	\N	205358.40	68452.80	0.00	136905.60	0.00	OFFICE	\N	\N	\N	E0251144	\N	359.00003841/2025-76	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
148	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE FLORIDA PAULISTA	PREFEITURA	PD019838	T04	Ativo	\N	2024-02-09 09:00:00	2025-02-08 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	SISTEMA PORTAL DA TRANSPARENCIA	\N	\N	\N	E0190838	Contrato Encerrado	359.00001315/2024-91	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
303	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE NOVO HORIZONTE	PREFEITURA	PD023206	T01	Ativo	\N	2024-06-20 09:00:00	2025-06-19 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	DIGITALIZA????O	\N	\N	\N	E0230236	Delivery n??o consegue entregar os dados que o cliente solicitou	359.00005933/2023-29	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
458	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SANTA RITA D'OESTE	PREFEITURA	PD0251211	T0	Ativo	\N	2025-09-30 09:00:00	2026-09-29 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE	\N	\N	\N	E0251354	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
571	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE AMERICANA	PREFEITURA	PD022160	T02	Ativo	\N	2024-07-06 09:00:00	2025-07-05 09:00:00	\N	131115.04	35113.86	0.00	96001.18	0.00	NUVEM PUBLICA	\N	\N	\N	E0220205	Assinado	??359.00002245/2023-15	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1114	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SAO VICENTE	PREFEITURA	PD023274	T0	Ativo	\N	2023-05-30 09:00:00	2026-09-29 09:00:00	\N	2334340.80	318600.00	0.00	2015740.80	0.00	DaaS	\N	\N	\N	E0230313	\N	??359.00001868/2023-62	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
280	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE GUARULHOS	PREFEITURA	PD024134	T0	Ativo	\N	2024-05-08 09:00:00	2025-05-07 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	EMAIL COMO SERVICO - OFFICE BASICO	\N	\N	\N	E0240231	Assinado (Renovado no PD025087)	359.00003344/2024-97	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
485	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MONTE AZUL PAULISTA	PREFEITURA	PD0251380	T0	Ativo	\N	2025-10-23 09:00:00	2026-10-22 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	CIDADES.SP.GOV.BR	\N	\N	\N	E0251493	\N	359.00007884/2025-21	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
998	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE ORLANDIA	PREFEITURA	PD023348	T01	Ativo	\N	2024-08-01 09:00:00	2025-07-31 09:00:00	\N	94050.00	23512.50	0.00	70537.50	0.00	EMAIL COMO SERVI??O - OFFICE  BASICO	\N	\N	\N	E0230423	Assinado	35900004685/2023-07	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
324	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MACATUBA	PREFEITURA	PD251485	T0	Ativo	\N	2025-10-14 09:00:00	2026-10-13 09:00:00	\N	123338.64	6194.28	0.00	117144.36	0.00	PLATAFORMA COLABORATIVA I	\N	\N	\N	E0251599	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1155	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SERRA NEGRA	PREFEITURA	PD251123	T0	Ativo	\N	2025-06-06 09:00:00	2026-06-05 09:00:00	\N	94591.44	39413.10	0.00	55178.34	0.00	OFFICE	\N	\N	\N	E0251120	\N	359.00003849/2025-32	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
456	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE GUARULHOS	PREFEITURA	PD251013	T0	Ativo	\N	2025-05-08 09:00:00	2026-05-07 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE	\N	\N	\N	E0250102	\N	359.00003097/2025-18	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
813	PAULO MARCELLO DA SILVA FERREIRA	CAMARA MUNICIPAL DE CUBATAO	PREFEITURA	PD025117	T0	Ativo	\N	2025-02-17 09:00:00	2026-02-16 09:00:00	\N	5895.18	2251.59	0.00	3643.59	0.00	CERTIFICADO DIGITAL	\N	\N	\N	E0250135	\N	359.00000847/2025-91	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
379	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE TAQUARITINGA	PREFEITURA	PD022344	T0	Ativo	\N	2022-10-31 09:00:00	2025-10-30 09:00:00	\N	938666.04	0.00	0.00	938666.04	0.00	DAAS DESTOP BASICO,  DESKTOP AVAN??ADO, DESKTOP PLUS E NOTEBOOK PADR??O	\N	\N	\N	E0220448	Contrato assinado em papel	359.00007473/2025-35	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
717	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE JALES	PREFEITURA	PD024473	T0	Ativo	\N	2024-12-12 09:00:00	2025-12-11 09:00:00	\N	113812.50	89040.00	0.00	24772.50	0.00	EMAIL COMO SERVICO	\N	\N	\N	E0241049	08/12 - Aguardando minuta do cliente	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
844	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE AGUAS DA PRATA	PREFEITURA	PD020747	T05	Ativo	\N	2024-01-02 09:00:00	2025-01-01 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	SISTEMA PORTAL DA TRANSPARENCIA	\N	\N	\N	E0200747	Contrato Encerrado	359.00000448/2024-40	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1116	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE IRACEMAPOLIS	PREFEITURA	PD023268	T0	Ativo	\N	2023-06-01 09:00:00	2026-09-30 09:00:00	\N	438517.80	55224.00	0.00	383293.80	0.00	DaaS	\N	\N	\N	E0230307	\N	359.00002141/2023-01	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1229	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE SAO VICENTE	PREFEITURA	PD021081	T01	Ativo	\N	2024-09-28 09:00:00	2026-09-27 09:00:00	\N	2876845.36	306360.54	0.00	2570484.82	0.00	DaaS	\N	\N	\N	E0210107	\N	359.00006416/2024-58	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1173	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE BAURU	PREFEITURA	PD022353	T0	Ativo	\N	2023-02-10 09:00:00	2026-06-09 09:00:00	\N	3667035.60	456518.40	0.00	3210517.20	0.00	DaaS	\N	\N	\N	E0220460	\N	359.00008479/2025-20	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
150	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MOGI-GUACU	PREFEITURA	PD023056	T01	Ativo	\N	2024-05-31 09:00:00	2025-05-30 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE BASICO	\N	\N	\N	E0230065	Assinado (Renovado no PD251031)	359.00001095/2023-14	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
487	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE TAQUARITINGA	PREFEITURA	PD022344	T01	Ativo	\N	2025-10-31 06:00:00	2026-10-30 06:00:00	\N	938666.04	0.00	0.00	938666.04	0.00	DAAS DESTOP BASICO,  DESKTOP AVAN??ADO, DESKTOP PLUS E NOTEBOOK PADR??O	\N	\N	\N	E0220448	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
67	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE MOGI-GUACU	PREFEITURA	PD251025	T0	Ativo	\N	2025-07-07 09:00:00	2026-07-06 09:00:00	\N	445824.00	148608.00	0.00	297216.00	0.00	OFFICE	\N	\N	\N	E0251031	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
161	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE GUARACAI	PREFEITURA	PD024475	T0	Ativo	\N	2024-12-13 09:00:00	2025-12-12 09:00:00	\N	5342.40	4452.00	0.00	890.40	0.00	EMAIL COMO SERVI??O	\N	\N	\N	E0241051	08/12 - Aguardando minuta do cliente	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
149	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE BARRETOS	PREFEITURA	PD023119	T01	Ativo	\N	2024-05-23 09:00:00	2025-05-22 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	GEST??O DE ATENDIMENTO	\N	\N	\N	E0230140	\N	359.00003541/2023-25	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
350	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE JACAREI	PREFEITURA	PD024281	T0-T1	Ativo	\N	2024-08-16 09:00:00	2025-08-15 09:00:00	\N	0.00	0.00	0.00	0.00	0.00	OFFICE  BASICO	\N	\N	\N	E0240417	Assinado (Renovado no PD251232??)	359.00006912/2024-10	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
786	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE CANAS	PREFEITURA	PD024492	T0	Ativo	\N	2025-01-20 09:00:00	2026-01-19 09:00:00	\N	7123.20	5817.28	0.00	1305.92	0.00	OFFICE	\N	\N	\N	E0241070	02/12 - A Luciana Michelle disse que est?? aguardando a devolu????o das minutas pelo cliente	359.00009753/2024-05	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
761	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE IRACEMAPOLIS	PREFEITURA	PD022297	T0	Ativo	\N	2022-08-26 09:00:00	2026-01-09 09:00:00	\N	1773560.88	283483.20	0.00	1490077.68	0.00	DaaS	\N	\N	\N	E0220389	01/12 - Esse abri a demanda, PNPP:15244.2025	359.00004358/2024-28	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1108	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE JACAREI	PREFEITURA	PD251232	T0	Ativo	\N	2025-09-04 09:00:00	2026-09-03 09:00:00	\N	863416.80	127944.00	0.00	735472.80	0.00	PLATAFORMA COLABORATIVA I	\N	\N	\N	E0251147	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
1174	PAULO MARCELLO DA SILVA FERREIRA	MUNICIPIO DE GUARAREMA	PREFEITURA	PD251040	T0	Ativo	\N	2025-06-12 09:00:00	2026-06-11 09:00:00	\N	142269.00	47423.00	0.00	94846.00	0.00	OFFICE	\N	\N	\N	E0251055	\N	359.00001973/2025-63	\N	\N	\N	\N	\N	\N	\N	\N	2025-12-09 17:19:01.908	2025-12-09 17:19:01.908
\.


--
-- Data for Name: demands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demands (id, product, demand_number, status, artifact, complexity, weight, client_id, analyst_id, cycle_id, requester_id, created_date, qualification_date, expected_delivery_date, delivery_date, observation, frozen_time_minutes, last_frozen_at, support_analyst_id, delivery_date_change_reason, contract_id) FROM stdin;
13	AGNES - EGOV	OPTY2265	ENTREGUE	PROPOSTA	Medium	\N	1	36	6	35	2026-02-03 15:31:39.875	2025-12-01 03:00:00	2026-01-09 03:00:00	2026-01-09 03:00:00	-	0	\N	\N	\N	\N
14	AGNES - EGOV	OPTY2265	ENTREGUE	PROPOSTA	Medium	\N	1	36	6	35	2026-02-03 15:31:39.9	2025-12-01 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
16	ORACLE CLOUD	OPTY2383	ENTREGUE	PROPOSTA	Medium	\N	422	36	6	38	2026-02-03 15:31:40.052	2026-01-09 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
17	ADOBE	OPTY1318	ENTREGUE	PROPOSTA	Medium	\N	423	36	6	9	2026-02-03 15:31:40.126	2025-06-17 03:00:00	2025-11-04 03:00:00	2025-11-04 03:00:00	-	0	\N	\N	\N	\N
18	SISTEMAS LEGADOS	OPTY1536	ENTREGUE	PROPOSTA	Medium	\N	424	36	7	39	2026-02-03 15:31:40.219	2025-08-01 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
15	APACHE HOP	OPTY1885	CANCELADA	OR??AMENTO	Medium	\N	421	36	6	37	2026-02-03 15:31:39.971	2025-04-09 03:00:00	2025-12-17 03:00:00	\N	-	0	\N	\N	\N	\N
32	SIAF??SICO	14457.2025	CANCELADA	OR??AMENTO	Medium	\N	1	36	1	45	2026-02-03 15:31:41.03	2025-05-16 03:00:00	\N	\N	-	0	\N	\N	\N	\N
34	TRAMPOLIM	OPTY1893	PEND??NCIA COMERCIAL	OR??AMENTO	Medium	\N	430	51	1	50	2026-02-03 15:31:41.168	2025-12-22 03:00:00	2026-02-13 03:00:00	\N	-	0	\N	\N	\N	\N
35	DATAGRID	OPTY2248	PEND??NCIA COMERCIAL	PROPOSTA	Medium	\N	431	51	6	41	2026-02-03 15:31:41.236	2025-11-26 03:00:00	2026-02-13 03:00:00	\N	-	0	\N	\N	\N	\N
19	VOIP	OPTY1627	ENTREGUE	OR??AMENTO	Medium	\N	422	36	6	40	2026-02-03 15:31:40.304	2025-08-15 03:00:00	2025-12-08 03:00:00	2025-12-08 03:00:00	-	0	\N	\N	\N	\N
20	ADOBE	OPTY1318	ENTREGUE	PROPOSTA	Medium	\N	423	36	6	9	2026-02-03 15:31:40.33	2025-06-17 03:00:00	2025-12-26 03:00:00	2025-12-26 03:00:00	-	0	\N	\N	\N	\N
21	MICROSOFT 	OPTY1467	ENTREGUE	PROPOSTA	Medium	\N	425	36	1	41	2026-02-03 15:31:40.415	2025-07-15 03:00:00	2025-12-26 03:00:00	2025-12-26 03:00:00	-	0	\N	\N	\N	\N
22	CLOUD AWS E/OU HUAWEI	OPTY2211	ENTREGUE	OR??AMENTO	Medium	\N	426	36	6	42	2026-02-03 15:31:40.501	2025-11-26 03:00:00	2025-12-23 03:00:00	2025-12-23 03:00:00	-	0	\N	\N	\N	\N
23	CLOUD AWS	OPTY2211	ENTREGUE	OR??AMENTO	Medium	\N	426	36	6	43	2026-02-03 15:31:40.551	2025-11-26 03:00:00	2026-01-20 03:00:00	2026-01-20 03:00:00	-	0	\N	\N	\N	\N
24	ORACLE	OPTY1740	ENTREGUE	OR??AMENTO	Medium	\N	427	36	6	44	2026-02-03 15:31:40.648	2025-08-22 03:00:00	2026-01-23 03:00:00	2026-01-23 03:00:00	-	0	\N	\N	\N	\N
26	SISTEMAS LEGADOS	OPTY1485	ENTREGUE	PROPOSTA	Medium	\N	423	36	7	46	2026-02-03 15:31:40.803	2025-07-16 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
27	ORACLE	OPTY1740	ENTREGUE	OR??AMENTO	Medium	\N	427	36	6	47	2026-02-03 15:31:40.841	2025-08-22 03:00:00	2025-11-19 03:00:00	2025-11-19 03:00:00	-	0	\N	\N	\N	\N
28	STORAGE	12518.2024	ENTREGUE	PROPOSTA	Medium	\N	422	36	1	48	2026-02-03 15:31:40.881	2025-05-21 03:00:00	2025-11-27 03:00:00	2025-11-27 03:00:00	-	0	\N	\N	\N	\N
29	LICEN??AS SQL	OPTY2007	ENTREGUE	PROPOSTA	Medium	\N	428	36	6	49	2026-02-03 15:31:40.953	2025-10-03 03:00:00	2025-12-02 03:00:00	2025-12-02 03:00:00	-	0	\N	\N	\N	\N
30	ORACLE	OPTY1740	ENTREGUE	OR??AMENTO	Medium	\N	427	36	6	47	2026-02-03 15:31:40.981	2025-08-22 03:00:00	2025-12-02 03:00:00	2025-12-02 03:00:00	-	0	\N	\N	\N	\N
31	SISTEMA CONDEPHAAT	OPTY2178	ENTREGUE	OR??AMENTO	Medium	\N	428	36	6	49	2026-02-03 15:31:41.006	2025-11-10 03:00:00	2025-12-01 03:00:00	2025-12-01 03:00:00	-	0	\N	\N	\N	\N
36	GEST??O CENTRALIZADA CREDENCIAIS ACESSOS	OPTY1973	ENTREGUE	PROPOSTA	Medium	\N	432	53	6	52	2026-02-03 15:31:41.354	2025-09-18 03:00:00	2025-11-10 03:00:00	2025-11-10 03:00:00	-	0	\N	\N	\N	\N
37	SOC AJUSTE DE ESP	OPTY1750	ENTREGUE	PROPOSTA	Medium	\N	1	53	6	54	2026-02-03 15:31:41.412	2025-12-17 03:00:00	2025-12-19 03:00:00	2025-12-19 03:00:00	-	0	\N	\N	\N	\N
38	DYNATRACE	OPTY1504	ENTREGUE	PROPOSTA	Medium	\N	433	53	6	39	2026-02-03 15:31:41.463	2025-07-24 03:00:00	2025-10-22 03:00:00	2025-10-22 03:00:00	-	0	\N	\N	\N	\N
39	CMS	OPTY1328	ENTREGUE	PROPOSTA	Medium	\N	1	53	6	38	2026-02-03 15:31:41.493	2025-06-23 03:00:00	2025-11-06 03:00:00	2025-11-06 03:00:00	-	0	\N	\N	\N	\N
40	OUTSOURCING DE SERVI??OS	11270.2023	ENTREGUE	PROPOSTA	Medium	\N	434	53	7	50	2026-02-03 15:31:41.576	2023-10-24 03:00:00	2025-11-18 03:00:00	2025-11-18 03:00:00	-	0	\N	\N	\N	\N
41	GEST??O CENTRAL CREDENCIAIS ACESSOS	OPTY1545	ENTREGUE	PROPOSTA	Medium	\N	422	53	6	38	2026-02-03 15:31:41.607	2025-11-17 03:00:00	2025-11-18 03:00:00	2025-11-18 03:00:00	-	0	\N	\N	\N	\N
58	ORACLE VM	OPTY1586	CANCELADA	PROPOSTA	Medium	\N	422	53	1	39	2026-02-03 15:31:42.551	2025-08-08 03:00:00	2025-12-05 03:00:00	\N	-	0	\N	\N	\N	\N
59	LICEN??AS ADOBE CLOUD	OPTY2044	CANCELADA	PROPOSTA	Medium	\N	446	53	6	39	2026-02-03 15:31:42.607	2025-10-10 03:00:00	\N	\N	-	0	\N	\N	\N	\N
60	ADOBE CLOUD	OPTY2044	CANCELADA	OR??AMENTO	Medium	\N	446	53	6	38	2026-02-03 15:31:42.628	2025-10-10 03:00:00	\N	\N	-	0	\N	\N	\N	\N
71	PRODESP SHIELD	OPTY1294	EM ANDAMENTO	OR??AMENTO	Medium	\N	422	53	6	40	2026-02-03 15:31:43.078	2025-06-12 03:00:00	2026-02-13 03:00:00	\N	-	0	\N	\N	\N	\N
72	DATALAKE	OPTY2269	EM ANDAMENTO	OR??AMENTO	Medium	\N	453	53	6	50	2026-02-03 15:31:43.113	2025-12-01 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
82	CONTRATO UNIFICADO	OPTY1277	PEND??NCIA DOP	PROPOSTA	Medium	\N	424	63	6	66	2026-02-03 15:31:43.499	2025-08-25 03:00:00	2026-02-03 03:00:00	\N	-	0	\N	\N	\N	\N
83	SIAL INTEGRADO (AJUSTE)	OPTY1737	PEND??NCIA DDS	PROPOSTA	Medium	\N	424	63	6	46	2026-02-03 15:31:43.519	2025-08-22 03:00:00	2026-02-03 03:00:00	\N	-	0	\N	\N	\N	\N
85	BPO - M??O DE OBRA	OPTY1988	CANCELADA	OR??AMENTO	Medium	\N	432	68	6	52	2026-02-03 15:31:43.597	2025-09-29 03:00:00	\N	\N	-	0	\N	\N	\N	\N
86	ERP ORACLE FUSION	OPTY2260	CANCELADA	OR??AMENTO	Medium	\N	422	68	6	38	2026-02-03 15:31:43.621	2025-11-28 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
87	NUVEM P??BLICA	OPTY1730	CANCELADA	OR??AMENTO	Medium	\N	422	68	1	38	2026-02-03 15:31:43.643	2025-08-28 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
93	SOLU????O DNS, DHCP, IPAM/PROXY	OPTY1979	CANCELADA	OR??AMENTO	Medium	\N	421	68	6	70	2026-02-03 15:31:43.877	2025-11-10 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
94	SERVICENOW	OPTY1891	CANCELADA	OR??AMENTO	Medium	\N	422	68	6	39	2026-02-03 15:31:43.938	2025-09-05 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
95	PAAS MIDDLEWARE	OPTY2034	CANCELADA	OR??AMENTO	Medium	\N	453	68	7	71	2026-02-03 15:31:44.009	2025-10-09 03:00:00	\N	\N	-	0	\N	\N	\N	\N
97	LOCA????O TABLET CATMAT	OPTY2206	CANCELADA	OR??AMENTO	Medium	\N	423	68	6	73	2026-02-03 15:31:44.134	2025-11-17 03:00:00	2025-11-26 03:00:00	\N	-	0	\N	\N	\N	\N
98	SISTEMA PKCA	OPTY2483	CANCELADA	PROPOSTA	Medium	\N	422	68	1	38	2026-02-03 15:31:44.152	2026-01-22 03:00:00	2026-02-09 03:00:00	\N	-	0	\N	\N	\N	\N
100	ADOBE MIDDLEWARE	OPTY2407	CANCELADA	OR??AMENTO	Medium	\N	459	74	6	38	2026-02-03 15:31:44.296	2026-01-15 03:00:00	2026-01-15 03:00:00	\N	-	0	\N	\N	\N	\N
102	DATALAKE	OPTY1401	CONGELADA	OR??AMENTO	Medium	\N	460	74	6	49	2026-02-03 15:31:44.371	2025-07-07 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
103	SALESFORCE	OPTY1984	PEND??NCIA FORNECEDOR	OR??AMENTO	Medium	\N	431	74	6	41	2026-02-03 15:31:44.415	2025-09-26 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
105	ARMAZENAMENTO CLOUD	OPTY2527	PEND??NCIA COMERCIAL	OR??AMENTO	Medium	\N	461	74	6	75	2026-02-03 15:31:44.546	2026-01-28 03:00:00	2026-02-11 03:00:00	\N	-	0	\N	\N	\N	\N
106	ATENDIMENTO CRM	OPTY1599	CANCELADA	OR??AMENTO	Medium	\N	1	74	6	38	2026-02-03 15:31:44.572	2025-08-12 03:00:00	2026-01-30 03:00:00	\N	-	0	\N	\N	\N	\N
107	O365 IA GENERATIVA	OPTY2088	CONGELADA	OR??AMENTO	Medium	\N	462	74	6	41	2026-02-03 15:31:44.645	2025-12-10 03:00:00	2026-01-16 03:00:00	\N	-	0	\N	\N	\N	\N
108	PLATAFORMA IA FISCAL	OPTY1974	EM QUALIFICA????O	OR??AMENTO	Medium	\N	463	74	6	57	2026-02-03 15:31:44.692	2025-11-06 03:00:00	2026-02-13 03:00:00	\N	-	0	\N	\N	\N	\N
25	SIAFÍSICO	OPTY2215	EM ANDAMENTO	OR??AMENTO	Medium	1	1	36	1	45	2026-02-03 15:31:40.734	2025-11-18 06:00:00	2026-02-06 06:00:00	\N	-	0	\N	\N	\N	\N
99	IA MICROSOFT	OPTY2427	EM ANDAMENTO	Orçamento	Média	1	458	68	6	50	2026-02-03 15:31:44.225	2026-01-19 12:00:00	2026-02-04 12:00:00	\N	-	0	\N	\N	\N	\N
104	SOLUÇÃO MICROSOFT + HUAWEI	OPTY2271	PENDÊNCIA COMERCIAL	Orçamento	Média	1	425	74	6	41	2026-02-03 15:31:44.452	2025-12-01 12:00:00	2026-02-11 12:00:00	\N	-	0	\N	\N	\N	\N
33	INFRA LINK ÓPTICO	OPTY2517	EM ANDAMENTO	PROPOSTA	Baixa	1	429	36	6	38	2026-02-03 15:31:41.071	2026-01-27 12:00:00	2026-02-11 12:00:00	\N	-	0	\N	\N	\N	\N
84	UNIFICAÇÃO DE ESP'S	OPTY2043	EM ANDAMENTO	Proposta	Alta	1	422	63	7	38	2026-02-03 15:31:43.56	2025-10-10 15:00:00	2026-02-06 15:00:00	\N	-	0	\N	\N	\N	\N
109	IBM PAAS MIDDLEWARE	OPTY2233	PEND??NCIA FORNECEDOR	OR??AMENTO	Medium	\N	451	74	6	9	2026-02-03 15:31:44.718	2025-11-21 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
112	POWER BI DATA FABRIC	OPTY2342	PEND??NCIA DDS	PROPOSTA	Medium	\N	465	77	7	78	2026-02-03 15:31:44.911	2026-01-02 03:00:00	2026-02-20 03:00:00	\N	-	0	\N	\N	\N	\N
114	TRAMPOLIM (PD024071)	OPTY2495	PEND??NCIA COMERCIAL	PROPOSTA	Medium	\N	430	77	1	50	2026-02-03 15:31:44.96	2026-01-23 03:00:00	2026-02-11 03:00:00	\N	-	0	\N	\N	\N	\N
117	SERVI??O DE PROTE????O ANTI BOT	OPTY2052	CANCELADA	OR??AMENTO	Medium	\N	431	58	6	56	2026-02-03 15:31:45.02	2025-10-15 03:00:00	2025-12-02 03:00:00	\N	-	0	\N	\N	\N	\N
119	PRODESP SHIELD	OPTY2541	PEND??NCIA FORNECEDOR	OR??AMENTO	Medium	\N	452	58	6	49	2026-02-03 15:31:45.055	2026-01-29 03:00:00	2026-02-05 03:00:00	\N	-	0	\N	\N	\N	\N
139	DATA CENTER GEST??O E FIREWALL	OPTY1591	CANCELADA	OR??AMENTO	Medium	\N	468	80	6	39	2026-02-03 15:31:45.704	2025-08-11 03:00:00	2025-12-05 03:00:00	\N	-	0	\N	\N	\N	\N
145	CLOUD AZURE	OPTY2377	PEND??NCIA FORNECEDOR	OR??AMENTO	Medium	\N	470	80	6	88	2026-02-03 15:31:45.968	2026-01-09 03:00:00	2026-02-05 03:00:00	\N	-	0	\N	\N	\N	\N
147	AZURE VIRTUAL DESKTOP	OPTY2258	PEND??NCIA DOP	PROPOSTA	Medium	\N	455	80	6	9	2026-02-03 15:31:46.043	2025-11-27 03:00:00	2026-02-02 03:00:00	\N	-	0	\N	\N	\N	\N
149	CLOUD AWS + CLARO (STORAGE)	OPTY1992	PEND??NCIA DOP	OR??AMENTO	Medium	\N	437	80	6	89	2026-02-03 15:31:46.151	2025-09-29 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
150	SEM PAPEL - APESP	OPTY2343	PEND??NCIA DDS	OR??AMENTO	Medium	\N	1	80	6	38	2026-02-03 15:31:46.175	2025-08-12 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
151	IA GOOGLE	OPTY2375	EM ANDAMENTO	OR??AMENTO	Medium	\N	425	80	6	41	2026-02-03 15:31:46.197	2026-01-09 03:00:00	2026-02-20 03:00:00	\N	-	0	\N	\N	\N	\N
101	PLANNER MIDDLEWARE	OPTY1567	ENTREGUE	OR??AMENTO	Medium	\N	427	74	6	49	2026-02-03 15:31:44.319	2025-08-07 03:00:00	2025-11-13 03:00:00	2025-11-13 03:00:00	-	0	\N	\N	\N	\N
152	SISTEMA SGA	OPTY2335	EM ANDAMENTO	OR??AMENTO	Medium	\N	471	80	6	9	2026-02-03 15:31:46.241	2025-12-19 03:00:00	2026-02-06 03:00:00	\N	-	0	\N	\N	\N	\N
153	GOOGLE WORKSPACE	OPTY1870	CANCELADA	OR??AMENTO	Medium	\N	472	90	6	72	2026-02-03 15:31:46.308	2025-09-03 03:00:00	\N	\N	-	0	\N	\N	\N	\N
156	GEOSERVER	OPTY2078	CANCELADA	OR??AMENTO	Medium	\N	473	90	6	37	2026-02-03 15:31:46.445	2025-10-20 03:00:00	2026-01-16 03:00:00	\N	-	0	\N	\N	\N	\N
163	ACCESS POINT	OPTY1282	CANCELADA	OR??AMENTO	Medium	\N	455	93	6	9	2026-02-03 15:31:46.682	2025-06-09 03:00:00	2025-12-19 03:00:00	\N	-	0	\N	\N	\N	\N
164	HOSTING DATA CENTER PRODESP	OPTY2011	CANCELADA	OR??AMENTO	Medium	\N	1	93	6	94	2026-02-03 15:31:46.736	2025-10-03 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
165	VISIO P2	OPTY2056	CANCELADA	PROPOSTA	Medium	\N	1	93	6	94	2026-02-03 15:31:46.758	2025-10-16 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
166	DESENVOLVIMENTO FOPAG	OPTY1642	CANCELADA	PROPOSTA	Medium	\N	1	93	7	94	2026-02-03 15:31:46.778	2025-08-15 03:00:00	2025-12-23 03:00:00	\N	-	0	\N	\N	\N	\N
177	IAAS CONTRATO UNIFICADO	OPTY2210	EM ANDAMENTO	PROPOSTA	Medium	\N	1	93	7	96	2026-02-03 15:31:47.072	2025-11-18 03:00:00	2026-02-02 03:00:00	\N	-	0	\N	\N	\N	\N
178	LINKS MICROSOFT	OPTY2137	EM ANDAMENTO	PROPOSTA	Medium	\N	446	93	6	41	2026-02-03 15:31:47.098	2025-10-30 03:00:00	2026-02-03 03:00:00	\N	-	0	\N	\N	\N	\N
180	DAAS NOTEBOOK	OPTY1492	PEND??NCIA COMERCIAL	OR??AMENTO	Medium	\N	455	93	7	9	2026-02-03 15:31:47.143	2025-12-17 03:00:00	2026-01-30 03:00:00	\N	-	0	\N	\N	\N	\N
182	PORTAL TRAMPOLIM	OPTY1568	CANCELADA	PROPOSTA	Medium	\N	430	97	1	69	2026-02-03 15:31:47.198	2025-08-07 03:00:00	\N	\N	-	0	\N	\N	\N	\N
183	IAAS CONTRATO UNIFICADO	13945.2025	CANCELADA	OR??AMENTO	Medium	\N	1	97	7	39	2026-02-03 15:31:47.216	\N	\N	\N	-	0	\N	\N	\N	\N
184	LICEN??AS ADOBE	OPTY1527	CANCELADA	OR??AMENTO	Medium	\N	1	97	6	38	2026-02-03 15:31:47.233	2025-08-08 03:00:00	\N	\N	-	0	\N	\N	\N	\N
185	DYNAMICS MELHORIAS	OPTY1234	CANCELADA	OR??AMENTO	Medium	\N	432	97	6	46	2026-02-03 15:31:47.251	2025-05-20 03:00:00	\N	\N	-	0	\N	\N	\N	\N
186	CHECKPOINT	OPTY1461	CANCELADA	OR??AMENTO	Medium	\N	431	97	6	41	2026-02-03 15:31:47.284	2025-07-11 03:00:00	\N	\N	-	0	\N	\N	\N	\N
187	HOSPEDAGEM AZURE	OPTY1600	CANCELADA	OR??AMENTO	Medium	\N	430	97	6	98	2026-02-03 15:31:47.325	2025-08-11 03:00:00	\N	\N	-	0	\N	\N	\N	\N
188	OUTSOURCING SERVI??OS	OPTY1314	CANCELADA	OR??AMENTO	Medium	\N	446	97	6	41	2026-02-03 15:31:47.349	2025-06-24 03:00:00	\N	\N	-	0	\N	\N	\N	\N
193	SALESFORCE	OPTY1550	CONGELADA	OR??AMENTO	Medium	\N	423	97	6	9	2026-02-03 15:31:47.503	2025-08-06 03:00:00	\N	\N	-	0	\N	\N	\N	\N
194	IA CFTV	OPTY1487	CONGELADA	OR??AMENTO	Medium	\N	456	97	6	9	2026-02-03 15:31:47.521	2025-07-17 03:00:00	\N	\N	-	0	\N	\N	\N	\N
195	PLAT. UNIFICADA DADOS E COMPLIANCE	OPTY2116	CANCELADA	OR??AMENTO	Medium	\N	453	97	6	50	2026-02-03 15:31:47.539	2025-10-28 03:00:00	\N	\N	-	0	\N	\N	\N	\N
196	VIA F??CIL	OPTY2179	CANCELADA	OR??AMENTO	Medium	\N	480	97	6	50	2026-02-03 15:31:47.574	2025-11-10 03:00:00	\N	\N	-	0	\N	\N	\N	\N
197	NUVEM	OPTY2035	CANCELADA	PROPOSTA	Medium	\N	453	97	1	50	2026-02-03 15:31:47.592	2025-10-09 03:00:00	\N	\N	-	0	\N	\N	\N	\N
198	MULTICLOUD	OPTY2183	CANCELADA	OR??AMENTO	Medium	\N	481	97	6	99	2026-02-03 15:31:47.649	2025-11-11 03:00:00	\N	\N	-	0	\N	\N	\N	\N
199	SISTEMA VRE	OPTY1980	CANCELADA	OR??AMENTO	Medium	\N	482	97	6	100	2026-02-03 15:31:47.706	2025-09-26 03:00:00	\N	\N	-	0	\N	\N	\N	\N
204	INTRAGOV	OPTY2535	PENDENTE TRIAGEM	OR??AMENTO	Medium	\N	479	97	6	45	2026-02-03 15:31:47.817	2026-01-28 03:00:00	\N	\N	-	0	\N	\N	\N	\N
205	CONTRATO UNIFICADO	OPTY1539	CONGELADA	OR??AMENTO	Medium	\N	441	97	7	39	2026-02-03 15:31:47.834	2025-08-04 03:00:00	\N	\N	-	0	\N	\N	\N	\N
206	ARMAZENAMENTO EM NUVEM	OPTY2525	PENDENTE TRIAGEM	OR??AMENTO	Medium	\N	443	97	6	50	2026-02-03 15:31:47.852	2026-01-28 03:00:00	\N	\N	-	0	\N	\N	\N	\N
181	LICENÇAS ADOBE	OPTY2008	EM ANDAMENTO	Orçamento	Média	1	455	93	6	9	2026-02-03 15:31:47.162	2025-10-03 12:00:00	2026-01-30 12:00:00	\N	-	0	\N	\N	\N	\N
208	COLETA BIOMÉTRICA	OPTY2434	PENDENTE TRIAGEM	Orçamento	Medium	1	484	97	6	101	2026-02-03 15:31:47.946	2026-01-21 09:00:00	\N	\N	-	0	\N	\N	\N	\N
161	OUTSOURCING DE SERVIÇOS	OPTY1926	CONGELADA	Orçamento	Medium	1	474	90	6	49	2026-02-03 15:31:46.625	2025-09-10 12:00:00	2026-01-23 12:00:00	\N	-	0	2026-02-06 00:23:42.77	\N	\N	\N
148	ARQUIVO PÚBLICO	OPTY2424	PENDÊNCIA DDS	Proposta	Medium	1	1	80	6	38	2026-02-03 15:31:46.067	2026-01-14 12:00:00	2026-02-02 12:00:00	\N	-	0	\N	\N	\N	\N
146	AUTOMAÇÃO IA	OPTY1790	CONGELADA	Orçamento	Média	1	455	80	6	9	2026-02-03 15:31:46.004	2025-08-29 12:00:00	2026-01-31 12:00:00	\N	-	0	2026-02-06 00:25:12.161	\N	\N	\N
111	MIGRAÇÃO AZURE	OPTY2388	PENDÊNCIA DOP	Orçamento	Medium	1	455	77	7	9	2026-02-03 15:31:44.843	2026-01-09 12:00:00	2026-02-06 12:00:00	\N	-	0	\N	\N	\N	\N
118	ITO + CYBERSEGURANÇA	OPTY2394	EM QUALIFICAÇÃO	Orçamento	Medium	1	441	58	1	55	2026-02-03 15:31:45.037	2026-01-26 15:00:00	2026-02-19 15:00:00	\N	-	0	\N	\N	\N	\N
113	CMS(ELABORAÇÃO RT)	OPTY1328	PENDÊNCIA FORNECEDOR	Proposta	Média	1	1	77	6	38	2026-02-03 15:31:44.935	2025-06-23 15:00:00	2026-02-05 15:00:00	\N	-	0	\N	\N	\N	\N
110	MICROSOFT LICENÇAS	OPTY2500	DESIGNADA	Orçamento	Baixa	1	464	74	6	103	2026-02-03 15:31:44.802	2026-01-30 18:00:00	2026-02-16 18:00:00	\N	-	0	\N	\N	\N	\N
202	POWER BI	OPTY1301	TRIAGEM NÃO ELEGÍVEL	Orçamento	Medium	1	430	97	6	98	2026-02-03 15:31:47.76	2025-06-13 06:00:00	\N	\N	-	0	\N	\N	\N	\N
191	AVA MOODLE	OPTY1434	CONGELADA	Orçamento	Medium	1	475	97	6	49	2026-02-03 15:31:47.466	2025-07-08 09:00:00	\N	\N	-	0	2026-02-06 00:38:04.355	\N	\N	\N
207	GUARDA DE DADOS	OPTY2417	PENDENTE TRIAGEM	Orçamento	Medium	1	483	97	6	75	2026-02-03 15:31:47.887	2026-01-16 09:00:00	\N	\N	-	0	\N	\N	\N	\N
159	SPDOC	OPTY2310	PENDÊNCIA DDS	Orçamento	Média	1	1	90	7	38	2026-02-03 15:31:46.569	2025-09-23 09:00:00	2026-02-05 09:00:00	\N	-	0	\N	\N	\N	\N
160	CETTPRO	OPTY2000	PENDÊNCIA DDS	Proposta	Baixa	1	430	90	1	50	2026-02-03 15:31:46.589	2025-10-02 09:00:00	2026-02-05 09:00:00	\N	-	0	\N	\N	\N	\N
158	HUAWEI CLOUD	OPTY2027	PENDÊNCIA DOP	Orçamento	Média	1	436	90	6	91	2026-02-03 15:31:46.517	2025-10-08 09:00:00	2026-02-05 09:00:00	\N	-	0	\N	\N	\N	\N
210	GOOGLE WORKSPACE	OPTY2545	PENDENTE TRIAGEM	OR??AMENTO	Medium	\N	427	97	6	49	2026-02-03 15:31:47.986	2026-01-30 03:00:00	\N	\N	-	0	\N	\N	\N	\N
213	SUPORTE INFRA	OPTY2477	TRIAGEM N??O ELEG??VEL	OR??AMENTO	Medium	\N	485	97	6	49	2026-02-03 15:31:48.059	2026-01-22 03:00:00	\N	\N	-	0	\N	\N	\N	\N
215	GOOGLE CLOUD	14209.2025	CANCELADA	OR??AMENTO	Medium	\N	487	97	1	39	2026-02-03 15:31:48.129	\N	\N	\N	-	0	\N	\N	\N	\N
216	CETTPRO	14358.2025	CANCELADA	OR??AMENTO	Medium	\N	430	97	7	39	2026-02-03 15:31:48.145	\N	\N	\N	-	0	\N	\N	\N	\N
217	DAAS - 24 MESES	15178.2025	CANCELADA	OR??AMENTO	Medium	\N	488	97	\N	39	2026-02-03 15:31:48.185	\N	\N	\N	-	0	\N	\N	\N	\N
218	IA DESENVOLVIMENTO	OPTY1497	CANCELADA	OR??AMENTO	Medium	\N	489	97	6	39	2026-02-03 15:31:48.219	2025-07-22 03:00:00	\N	\N	-	0	\N	\N	\N	\N
219	POWER AUTOMATE	OPTY1869	CANCELADA	OR??AMENTO	Medium	\N	490	97	6	39	2026-02-03 15:31:48.252	2025-09-03 03:00:00	\N	\N	-	0	\N	\N	\N	\N
221	CRM (SALES FORCE OU SERVICE NOW)	OPTY1264	CONGELADA	OR??AMENTO	Medium	\N	491	97	6	9	2026-02-03 15:31:48.305	2025-06-02 03:00:00	\N	\N	-	0	\N	\N	\N	\N
250	LOCA????O TABLET CATMAT	OPTY1994	CANCELADA	OR??AMENTO	Medium	\N	423	105	6	39	2026-02-03 15:31:49.272	2025-10-01 03:00:00	\N	\N	-	0	\N	\N	\N	\N
115	PRODESP CLOUD (PD020121)	OPTY2519	EM ANDAMENTO	PROPOSTA	Medium	1	423	77	1	66	2026-02-03 15:31:44.977	2026-01-26 06:00:00	2026-02-18 06:00:00	\N	Aguardando conversa com o Ramiro para alinhamento da topologia	0	\N	\N	\N	\N
222	PRODESP SHIELD	OPTY1294	ENTREGUE	OR??AMENTO	Medium	\N	422	97	6	39	2026-02-03 15:31:48.323	2025-06-12 03:00:00	2025-11-12 03:00:00	2025-11-12 03:00:00	-	0	\N	\N	\N	\N
223	PRODESP SHIELD	OPTY2002	ENTREGUE	OR??AMENTO	Medium	\N	492	97	6	55	2026-02-03 15:31:48.366	2025-10-02 03:00:00	2025-11-11 03:00:00	2025-11-11 03:00:00	-	0	\N	\N	\N	\N
224	PRODESP SHIELD	OPTY2085	ENTREGUE	OR??AMENTO	Medium	\N	453	97	6	50	2026-02-03 15:31:48.384	2025-10-21 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
249	PRODESP SHIELD	OPTY1294	ENTREGUE	Proposta	M??dia	1	422	105	6	40	2026-02-03 15:31:49.252	2025-06-12 15:00:00	2025-12-18 15:00:00	2026-02-04 03:00:00	-	-180	\N	\N	\N	\N
42	PRODESP SHIELD	OPTY1902	ENTREGUE	OR??AMENTO	Medium	\N	435	53	6	50	2026-02-03 15:31:41.661	2025-11-17 03:00:00	2025-11-28 03:00:00	2025-11-28 03:00:00	-	0	\N	\N	\N	\N
43	PRODESP SHIELD	OPTY1908	ENTREGUE	OR??AMENTO	Medium	\N	436	53	6	50	2026-02-03 15:31:41.718	2025-09-08 03:00:00	2025-11-24 03:00:00	2025-11-24 03:00:00	-	0	\N	\N	\N	\N
44	PRODESP SHIELD	OPTY2218	ENTREGUE	OR??AMENTO	Medium	\N	437	53	6	55	2026-02-03 15:31:41.884	2025-12-08 03:00:00	2025-12-11 03:00:00	2025-12-11 03:00:00	-	0	\N	\N	\N	\N
45	ALTERA????O DE PO E ESP	OPTY2276	ENTREGUE	PROPOSTA	Medium	\N	438	53	6	38	2026-02-03 15:31:41.987	2025-12-05 03:00:00	2025-12-16 03:00:00	2025-12-16 03:00:00	-	0	\N	\N	\N	\N
46	GEST??O CENTRAL CREDENCIAIS ACESSOS	OPTY1545	ENTREGUE	OR??AMENTO	Medium	\N	422	53	6	38	2026-02-03 15:31:42.013	2025-12-17 03:00:00	2025-12-19 03:00:00	2025-12-19 03:00:00	-	0	\N	\N	\N	\N
47	PRODESP SHIELD	OPTY2321	ENTREGUE	OR??AMENTO	Medium	\N	439	53	6	54	2026-02-03 15:31:42.056	2025-12-17 03:00:00	2025-12-23 03:00:00	2025-12-23 03:00:00	-	0	\N	\N	\N	\N
48	MICROSOFT CONTACT CENTER PLATFORM	OPTY2058	ENTREGUE	PROPOSTA	Medium	\N	431	53	6	56	2026-02-03 15:31:42.124	2025-10-17 03:00:00	2025-12-22 03:00:00	2025-12-22 03:00:00	-	0	\N	\N	\N	\N
225	ADOBE PRIVACY SERVICE	OPTY1457	ENTREGUE	OR??AMENTO	Medium	\N	493	97	6	38	2026-02-03 15:31:48.442	2025-07-11 03:00:00	2025-11-24 03:00:00	2025-11-24 03:00:00	-	0	\N	\N	\N	\N
49	ERP MICROSOFT	OPTY2039	ENTREGUE	OR??AMENTO	Medium	\N	440	53	6	57	2026-02-03 15:31:42.217	2025-12-01 03:00:00	2026-01-23 03:00:00	2026-01-23 03:00:00	-	0	\N	\N	\N	\N
50	TABLEAU SALESFORCE	OPTY1912	ENTREGUE	PROPOSTA	Medium	\N	441	53	6	39	2026-02-03 15:31:42.278	2025-09-09 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
51	PRODESP SHIELD	OPTY1597	ENTREGUE	OR??AMENTO	Medium	\N	425	53	6	58	2026-02-03 15:31:42.313	2025-08-15 03:00:00	2025-11-06 03:00:00	2025-11-06 03:00:00	-	0	\N	\N	\N	\N
52	ALTERA????O DE ESP	13614.2024	ENTREGUE	PROPOSTA	Medium	\N	429	53	6	38	2026-02-03 15:31:42.33	2024-12-23 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
53	LICEN??AS ADOBE	OPTY2200	ENTREGUE	OR??AMENTO	Medium	\N	442	53	6	59	2026-02-03 15:31:42.381	2025-11-14 03:00:00	2025-11-25 03:00:00	2025-11-25 03:00:00	-	0	\N	\N	\N	\N
54	DYNATRACE MONITORAMENTO	OPTY1832	ENTREGUE	OR??AMENTO	Medium	\N	443	53	6	46	2026-02-03 15:31:42.43	2025-09-02 03:00:00	2025-12-04 03:00:00	2025-12-04 03:00:00	-	0	\N	\N	\N	\N
55	RENOVA????O PD023151	OPTY2294	ENTREGUE	PROPOSTA	Medium	\N	444	53	1	9	2026-02-03 15:31:42.469	2025-12-12 03:00:00	2026-01-12 03:00:00	2026-01-12 03:00:00	-	0	\N	\N	\N	\N
56	CREATIVE CLOUD	OPTY2308	ENTREGUE	OR??AMENTO	Medium	\N	445	53	6	9	2026-02-03 15:31:42.509	2025-12-16 03:00:00	2026-01-22 03:00:00	2026-01-22 03:00:00	-	0	\N	\N	\N	\N
57	MICROSOFT CONTACT CENTER PLATFORM	OPTY2058	ENTREGUE	PROPOSTA	Medium	\N	431	53	6	56	2026-02-03 15:31:42.528	2025-10-17 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
61	CABEAMENTO ESTRUTURADO	14343.2025	ENTREGUE	OR??AMENTO	Medium	\N	447	53	\N	46	2026-02-03 15:31:42.672	2025-04-24 03:00:00	2025-11-05 03:00:00	2025-11-05 03:00:00	-	0	\N	\N	\N	\N
62	KCR, PIR, PBI e KCX	14207.2025	ENTREGUE	PROPOSTA	Medium	\N	448	53	\N	46	2026-02-03 15:31:42.708	2025-03-31 03:00:00	2025-11-13 03:00:00	2025-11-13 03:00:00	-	0	\N	\N	\N	\N
63	GEST??O CENTRALIZADA	OPTY1546	ENTREGUE	PROPOSTA	Medium	\N	432	53	6	46	2026-02-03 15:31:42.727	2025-08-05 03:00:00	2025-11-10 03:00:00	2025-11-10 03:00:00	-	0	\N	\N	\N	\N
64	SERVICE DESK - AJUSTE	10888.2023	ENTREGUE	PROPOSTA	Medium	\N	449	53	\N	60	2026-02-03 15:31:42.834	2023-08-03 03:00:00	2025-11-12 03:00:00	2025-11-12 03:00:00	-	0	\N	\N	\N	\N
65	SOLU????O HSM	OPTY2138	ENTREGUE	OR??AMENTO	Medium	\N	431	53	6	38	2026-02-03 15:31:42.855	2025-10-30 03:00:00	2025-11-27 03:00:00	2025-11-27 03:00:00	-	0	\N	\N	\N	\N
66	SERVI??OS DE IMPRESS??O	OPTY2283	ENTREGUE	PROPOSTA	Medium	\N	450	53	6	61	2026-02-03 15:31:42.923	2025-12-05 03:00:00	2025-12-16 03:00:00	2025-12-16 03:00:00	-	0	\N	\N	\N	\N
67	PRODESP SHIELD	OPTY1294	ENTREGUE	OR??AMENTO	Medium	\N	422	53	6	40	2026-02-03 15:31:42.946	2025-06-12 03:00:00	2026-01-21 03:00:00	2026-01-21 03:00:00	-	0	\N	\N	\N	\N
68	MICROSOFT FABRIC	OPTY2240	ENTREGUE	OR??AMENTO	Medium	\N	451	53	6	9	2026-02-03 15:31:42.983	2025-11-25 03:00:00	2025-12-05 03:00:00	2025-12-05 03:00:00	-	0	\N	\N	\N	\N
69	OUTSOURCING OP. DE SERVI??OS	OPTY1691	ENTREGUE	OR??AMENTO	Medium	\N	452	53	6	49	2026-02-03 15:31:43.036	2025-09-19 03:00:00	2025-12-26 03:00:00	2025-12-26 03:00:00	-	0	\N	\N	\N	\N
70	POWER BI PREMIUM	OPTY2368	ENTREGUE	PROPOSTA	Medium	\N	422	53	6	38	2026-02-03 15:31:43.056	2026-01-08 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
73	COLLOCATION/MOVING	OPTY1496	ENTREGUE	PROPOSTA	Medium	\N	454	63	6	62	2026-02-03 15:31:43.185	2025-07-22 03:00:00	2025-11-04 03:00:00	2025-11-04 03:00:00	-	0	\N	\N	\N	\N
74	SIAL INTEGRADO	OPTY1737	ENTREGUE	PROPOSTA	Medium	\N	424	63	6	46	2026-02-03 15:31:43.21	2025-08-22 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
75	LINKS MICROSOSFT	OPTY2137	ENTREGUE	OR??AMENTO	Medium	\N	446	63	6	38	2026-02-03 15:31:43.25	2025-10-30 03:00:00	2025-12-05 03:00:00	2025-12-05 03:00:00	-	0	\N	\N	\N	\N
246	PRODESP ON PREMISES - CONTRACHEQUE	OPTY2547	ENTREGUE	Proposta	Média	1	1	104	6	38	2026-02-03 15:31:49.095	2026-01-30 15:00:00	2026-02-06 15:00:00	2026-02-04 09:00:00	-	0	\N	\N	\N	\N
209	BACKBONE ÓPTICO	OPTY2551	CONGELADA	Orçamento	Medium	1	422	97	6	38	2026-02-03 15:31:47.965	2026-02-02 09:00:00	\N	\N	-	0	\N	\N	\N	\N
228	CLOUD AZURE	OPTY2420	PENDENTE TRIAGEM	Orçamento	Medium	1	483	97	6	75	2026-02-03 15:31:48.514	2026-01-27 21:00:00	\N	\N	-	0	\N	\N	\N	\N
220	GOOGLE CLOUD (NOVO)	OPTY2012	CONGELADA	Orçamento	Média	1	441	97	7	39	2026-02-03 15:31:48.269	2025-10-06 12:00:00	\N	\N	-	0	2026-02-06 00:37:03.821	\N	\N	\N
227	FIREWALL	OPTY2089	TRIAGEM NÃO ELEGÍVEL	Orçamento	Medium	1	438	97	6	38	2026-02-03 15:31:48.494	2025-10-22 09:00:00	\N	\N	-	0	\N	\N	\N	\N
214	APP PREVCOM E SOU SP	OPTY2026	TRIAGEM NÃO ELEGÍVEL	Orçamento	Medium	1	486	97	6	38	2026-02-03 15:31:48.095	2025-10-08 09:00:00	\N	\N	-	0	\N	\N	\N	\N
211	PAAS GOOGLE	OPTY2481	PENDENTE TRIAGEM	Orçamento	Medium	1	484	97	6	101	2026-02-03 15:31:48.004	2026-01-22 09:00:00	\N	\N	-	0	\N	\N	\N	\N
212	DESENVOLVIMENTO DE PLATAFORMA	OPTY2481	PENDENTE TRIAGEM	Orçamento	Medium	1	484	97	6	101	2026-02-03 15:31:48.023	2026-01-22 09:00:00	\N	\N	-	0	\N	\N	\N	\N
76	DESENVOLVIMENTO E MANUTEN????O CRM	OPTY1733	ENTREGUE	OR??AMENTO	Medium	\N	455	63	6	9	2026-02-03 15:31:43.29	2025-08-20 03:00:00	2026-01-02 03:00:00	2026-01-02 03:00:00	-	0	\N	\N	\N	\N
77	LINKS MICROSOSFT	OPTY2137	ENTREGUE	OR??AMENTO	Medium	\N	446	63	6	41	2026-02-03 15:31:43.311	2025-10-30 03:00:00	2026-01-09 03:00:00	2026-01-09 03:00:00	-	0	\N	\N	\N	\N
78	GUARDA DE DADOS - FOLHA PAGTO - SUCEN	OPTY2241	ENTREGUE	PROPOSTA	Medium	\N	437	63	6	64	2026-02-03 15:31:43.349	2025-11-25 03:00:00	2026-01-21 03:00:00	2026-01-21 03:00:00	-	0	\N	\N	\N	\N
79	ITO MIGRA????O INFRA	OPTY2040	ENTREGUE	PROPOSTA	Medium	\N	436	63	6	65	2026-02-03 15:31:43.399	2025-10-10 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
80	CONTRATO UNIFICADO	OPTY1277	ENTREGUE	OR??AMENTO	Medium	\N	424	63	6	39	2026-02-03 15:31:43.433	2025-08-25 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
88	WIFI	OPTY1336	ENTREGUE	PROPOSTA	Medium	\N	456	68	1	39	2026-02-03 15:31:43.687	2025-08-04 03:00:00	2025-10-21 03:00:00	2025-10-21 03:00:00	-	0	\N	\N	\N	\N
89	SUB-ROGA????O SEGREGA????O SRV	13454.2024	ENTREGUE	PROPOSTA	Medium	\N	1	68	7	39	2026-02-03 15:31:43.707	2024-11-19 03:00:00	2025-10-29 03:00:00	2025-10-29 03:00:00	-	0	\N	\N	\N	\N
90	AVAL. MUNICIPIOS + IA	OPTY1947	ENTREGUE	OR??AMENTO	Medium	\N	430	68	6	69	2026-02-03 15:31:43.747	2025-09-17 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
91	AUDITORIA FOLHA	OPTY1953	ENTREGUE	PROPOSTA	Medium	\N	1	68	6	38	2026-02-03 15:31:43.775	2025-09-19 03:00:00	2025-11-13 03:00:00	2025-11-13 03:00:00	-	0	\N	\N	\N	\N
92	AZURE VIRTUAL DESKTOP	OPTY2114	ENTREGUE	OR??AMENTO	Medium	\N	437	68	6	55	2026-02-03 15:31:43.804	2025-10-28 03:00:00	2026-01-08 03:00:00	2026-01-08 03:00:00	-	0	\N	\N	\N	\N
96	NUVEM MICROSOFT	OPTY2082	ENTREGUE	PROPOSTA	Medium	\N	457	68	6	72	2026-02-03 15:31:44.084	2025-10-21 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
116	SOC(ELABORA????O RT)	OPTY1750	ENTREGUE	PROPOSTA	Medium	\N	1	58	6	38	2026-02-03 15:31:45.002	2025-12-17 03:00:00	2026-01-23 03:00:00	2026-01-23 03:00:00	-	0	\N	\N	\N	\N
120	ONETRUST	OPTY2168	ENTREGUE	OR??AMENTO	Medium	\N	466	80	6	79	2026-02-03 15:31:45.138	2025-11-06 03:00:00	2025-11-21 03:00:00	2025-11-21 03:00:00	-	0	\N	\N	\N	\N
121	DESENVOLVIMENTO IA	OPTY2198	ENTREGUE	OR??AMENTO	Medium	\N	432	80	6	52	2026-02-03 15:31:45.157	2025-11-14 03:00:00	2025-11-19 03:00:00	2025-11-19 03:00:00	-	0	\N	\N	\N	\N
122	ONETRUST	OPTY2168	ENTREGUE	PROPOSTA	Medium	\N	466	80	6	79	2026-02-03 15:31:45.183	2025-11-06 03:00:00	2025-11-26 03:00:00	2025-11-26 03:00:00	-	0	\N	\N	\N	\N
123	UNIFICA????O 12 MESES	OPTY2229	ENTREGUE	PROPOSTA	Medium	\N	449	80	6	81	2026-02-03 15:31:45.22	2025-11-19 03:00:00	2026-01-21 03:00:00	2026-01-21 03:00:00	-	0	\N	\N	\N	\N
124	UNIFICA????O 12 MESES	OPTY2222	ENTREGUE	PROPOSTA	Medium	\N	449	80	6	81	2026-02-03 15:31:45.239	2025-11-19 03:00:00	2026-01-23 03:00:00	2026-01-23 03:00:00	-	0	\N	\N	\N	\N
125	UNIFICA????O 12 MESES	OPTY2225	ENTREGUE	PROPOSTA	Medium	\N	449	80	6	81	2026-02-03 15:31:45.26	2025-11-19 03:00:00	2026-01-23 03:00:00	2026-01-23 03:00:00	-	0	\N	\N	\N	\N
126	PLATAFORMA IA	OPTY2520	ENTREGUE	OR??AMENTO	Medium	\N	1	80	6	54	2026-02-03 15:31:45.279	2026-01-27 03:00:00	2026-01-27 03:00:00	2026-01-27 03:00:00	-	0	\N	\N	\N	\N
127	POWER BI LICEN??AS	OPTY1398	ENTREGUE	OR??AMENTO	Medium	\N	467	80	1	69	2026-02-03 15:31:45.314	2025-07-02 03:00:00	2025-10-29 03:00:00	2025-10-29 03:00:00	-	0	\N	\N	\N	\N
128	PRODESP SHIELD	OPTY1909	ENTREGUE	PROPOSTA	Medium	\N	458	80	6	82	2026-02-03 15:31:45.368	2025-09-08 03:00:00	2025-11-05 03:00:00	2025-11-05 03:00:00	-	0	\N	\N	\N	\N
129	CO-LOCATION	OPTY1406	ENTREGUE	OR??AMENTO	Medium	\N	454	80	6	69	2026-02-03 15:31:45.389	2025-07-03 03:00:00	2025-11-03 03:00:00	2025-11-03 03:00:00	-	0	\N	\N	\N	\N
130	POWER BI LICEN??AS	OPTY1398	ENTREGUE	PROPOSTA	Medium	\N	467	80	1	69	2026-02-03 15:31:45.408	2025-07-02 03:00:00	2025-11-10 03:00:00	2025-11-10 03:00:00	-	0	\N	\N	\N	\N
131	GOOGLE CLOUD	OPTY2146	ENTREGUE	PROPOSTA	Medium	\N	441	80	6	69	2026-02-03 15:31:45.427	2025-10-31 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
132	FOPAG E FOLHA (MELHORIAS)	OPTY1946	ENTREGUE	OR??AMENTO	Medium	\N	1	80	6	83	2026-02-03 15:31:45.464	2025-09-18 03:00:00	2025-12-04 03:00:00	2025-12-04 03:00:00	-	0	\N	\N	\N	\N
133	CONECTIVIDADE AZURE	OPTY2163	ENTREGUE	PROPOSTA	Medium	\N	439	80	6	84	2026-02-03 15:31:45.503	2025-11-17 03:00:00	2025-12-01 03:00:00	2025-12-01 03:00:00	-	0	\N	\N	\N	\N
134	AZURE VIRTUAL DESKTOP	OPTY2258	ENTREGUE	OR??AMENTO	Medium	\N	455	80	6	9	2026-02-03 15:31:45.525	2025-11-27 03:00:00	2025-12-15 03:00:00	2025-12-15 03:00:00	-	0	\N	\N	\N	\N
135	AZURE CLOUD (UNIFICA????O)	OPTY2018	ENTREGUE	OR??AMENTO	Medium	\N	455	80	6	9	2026-02-03 15:31:45.56	2025-12-01 03:00:00	2026-01-07 03:00:00	2026-01-07 03:00:00	-	0	\N	\N	\N	\N
136	LICEN??AS ADOBE	OPTY2200	ENTREGUE	PROPOSTA	Medium	\N	442	80	6	85	2026-02-03 15:31:45.595	2025-11-14 03:00:00	2026-01-09 03:00:00	2026-01-09 03:00:00	-	0	\N	\N	\N	\N
137	DATA LAKE BI	OPTY2314	ENTREGUE	OR??AMENTO	Medium	\N	455	80	6	9	2026-02-03 15:31:45.613	2025-12-17 03:00:00	2026-01-16 03:00:00	2026-01-16 03:00:00	-	0	\N	\N	\N	\N
138	DYNAMICS	OPTY1646	ENTREGUE	PROPOSTA	Medium	\N	423	80	7	86	2026-02-03 15:31:45.65	2025-08-15 03:00:00	2026-01-22 03:00:00	2026-01-22 03:00:00	-	0	\N	\N	\N	\N
140	PRODESP SHIELD	OPTY1909	ENTREGUE	OR??AMENTO	Medium	\N	458	80	6	82	2026-02-03 15:31:45.732	2025-09-08 03:00:00	2025-10-23 03:00:00	2025-10-23 03:00:00	-	0	\N	\N	\N	\N
141	SERVICENOW	OPTY1891	ENTREGUE	OR??AMENTO	Medium	\N	422	80	6	39	2026-02-03 15:31:45.751	2025-09-05 03:00:00	2025-11-07 03:00:00	2025-11-07 03:00:00	-	0	\N	\N	\N	\N
142	NUVEM MICROSOFT	OPTY1963	ENTREGUE	PROPOSTA	Medium	\N	469	80	6	87	2026-02-03 15:31:45.812	2025-09-23 03:00:00	2025-11-07 03:00:00	2025-11-07 03:00:00	-	0	\N	\N	\N	\N
143	PAAS CLOUD	OPTY2163	ENTREGUE	OR??AMENTO	Medium	\N	439	80	1	39	2026-02-03 15:31:45.832	2025-11-17 03:00:00	2025-11-17 03:00:00	2025-11-17 03:00:00	-	0	\N	\N	\N	\N
144	SQL SERVER	OPTY2010	ENTREGUE	OR??AMENTO	Medium	\N	431	80	6	41	2026-02-03 15:31:45.86	2025-10-03 03:00:00	2026-01-07 03:00:00	2026-01-07 03:00:00	-	0	\N	\N	\N	\N
154	BANCO DE DADOS	OPTY1796	ENTREGUE	OR??AMENTO	Medium	\N	1	90	6	39	2026-02-03 15:31:46.346	2025-09-12 03:00:00	2025-10-28 03:00:00	2025-10-28 03:00:00	-	0	\N	\N	\N	\N
155	OUTSOURCING DE SERVI??OS	OPTY2280	ENTREGUE	PROPOSTA	Medium	\N	441	90	7	55	2026-02-03 15:31:46.38	2025-12-04 03:00:00	2026-01-07 03:00:00	2026-01-07 03:00:00	-	0	\N	\N	\N	\N
157	FACILITA SP	OPTY1535	ENTREGUE	PROPOSTA	Medium	\N	424	90	7	39	2026-02-03 15:31:46.471	2025-08-01 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
162	DESENVOLVIMENTO SISTEMAS INTERNOS	OPTY1528	ENTREGUE	OR??AMENTO	Medium	\N	432	93	6	52	2026-02-03 15:31:46.662	2025-07-30 03:00:00	2025-11-21 03:00:00	2025-11-21 03:00:00	-	0	\N	\N	\N	\N
167	MOVING OCI	OPTY1359	ENTREGUE	PROPOSTA	Medium	\N	424	93	6	39	2026-02-03 15:31:46.795	2025-06-26 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
168	CARTEIRA DOEN??AS RARAS	OPTY2046	ENTREGUE	OR??AMENTO	Medium	\N	475	93	6	39	2026-02-03 15:31:46.831	2025-10-23 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
169	CARTEIRA DOEN??AS RARAS	OPTY2046	ENTREGUE	PROPOSTA	Medium	\N	476	93	6	95	2026-02-03 15:31:46.888	2025-10-23 03:00:00	2025-12-02 03:00:00	2025-12-02 03:00:00	-	0	\N	\N	\N	\N
170	MICROSOFT CONTACT CENTER PLATFORM	OPTY2058	ENTREGUE	OR??AMENTO	Medium	\N	431	93	6	56	2026-02-03 15:31:46.916	2025-10-17 03:00:00	2025-12-05 03:00:00	2025-12-05 03:00:00	-	0	\N	\N	\N	\N
171	AZURE MENSAGERIA E CHATBOT	OPTY1583	ENTREGUE	OR??AMENTO	Medium	\N	431	93	6	56	2026-02-03 15:31:46.934	2025-08-08 03:00:00	2025-12-08 03:00:00	2025-12-08 03:00:00	-	0	\N	\N	\N	\N
172	GOOGLE WORKSPACE	OPTY2273	ENTREGUE	OR??AMENTO	Medium	\N	472	93	6	72	2026-02-03 15:31:46.952	2025-12-02 03:00:00	2025-12-11 03:00:00	2025-12-11 03:00:00	-	0	\N	\N	\N	\N
173	MOVING OCI	OPTY1359	ENTREGUE	PROPOSTA	Medium	\N	424	93	6	39	2026-02-03 15:31:46.97	2025-06-26 03:00:00	2026-01-13 03:00:00	2026-01-13 03:00:00	-	0	\N	\N	\N	\N
174	SWITCH AS SERVICE	OPTY1834	ENTREGUE	PROPOSTA	Medium	\N	1	93	6	39	2026-02-03 15:31:46.987	2025-09-02 03:00:00	2025-11-19 03:00:00	2025-11-19 03:00:00	-	0	\N	\N	\N	\N
175	GOOGLE WORKSPACE	OPTY2081	ENTREGUE	OR??AMENTO	Medium	\N	434	93	6	50	2026-02-03 15:31:47.006	2025-10-20 03:00:00	2025-11-06 03:00:00	2025-11-06 03:00:00	-	0	\N	\N	\N	\N
176	PRODESP SHIELD	OPTY1483	ENTREGUE	OR??AMENTO	Medium	\N	477	93	6	55	2026-02-03 15:31:47.04	2025-07-16 03:00:00	2025-12-08 03:00:00	2025-12-08 03:00:00	-	0	\N	\N	\N	\N
179	CO-LOCATION (AZURE)	OPTY2199	ENTREGUE	OR??AMENTO	Medium	\N	460	93	6	49	2026-02-03 15:31:47.118	2025-11-14 03:00:00	2026-01-30 03:00:00	2026-01-30 03:00:00	-	0	\N	\N	\N	\N
189	CABEAMENTO ESTRUTURADO	OPTY1748	ENTREGUE	OR??AMENTO	Medium	\N	478	97	6	49	2026-02-03 15:31:47.402	2025-08-26 03:00:00	2025-11-21 03:00:00	2025-11-21 03:00:00	-	0	\N	\N	\N	\N
190	LICEN??AS SQL	OPTY1920	ENTREGUE	OR??AMENTO	Medium	\N	479	97	6	41	2026-02-03 15:31:47.438	2025-09-09 03:00:00	2025-11-21 03:00:00	2025-11-21 03:00:00	-	0	\N	\N	\N	\N
200	POWER BI PREMIUM	OPTY2368	ENTREGUE	OR??AMENTO	Medium	\N	422	97	6	38	2026-02-03 15:31:47.726	2026-01-08 03:00:00	2026-01-12 03:00:00	2026-01-12 03:00:00	-	0	\N	\N	\N	\N
201	POWER BI PREMIUM	OPTY2368	ENTREGUE	OR??AMENTO	Medium	\N	422	97	6	38	2026-02-03 15:31:47.743	2026-01-08 03:00:00	2026-01-19 03:00:00	2026-01-19 03:00:00	-	0	\N	\N	\N	\N
226	PRODESP SHIELD	OPTY1294	ENTREGUE	OR??AMENTO	Medium	\N	422	97	6	40	2026-02-03 15:31:48.466	2025-06-12 03:00:00	2025-12-08 03:00:00	2025-12-08 03:00:00	-	0	\N	\N	\N	\N
229	HIPERAUTOMA????O	OPTY2060	ENTREGUE	OR??AMENTO	Medium	\N	424	54	1	39	2026-02-03 15:31:48.537	2025-11-13 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
230	MURALHA PAULISTA	OPTY2313	ENTREGUE	PROPOSTA	Medium	\N	494	45	6	50	2026-02-03 15:31:48.577	2025-12-17 03:00:00	2026-01-21 03:00:00	2026-01-21 03:00:00	-	0	\N	\N	\N	\N
231	TABLEAU SALESFORCE	OPTY1912	ENTREGUE	OR??AMENTO	Medium	\N	441	45	6	39	2026-02-03 15:31:48.606	2025-09-09 03:00:00	2025-11-14 03:00:00	2025-11-14 03:00:00	-	0	\N	\N	\N	\N
232	IAAS/PAAS ORACLE	OPTY2282	ENTREGUE	OR??AMENTO	Medium	\N	421	45	6	37	2026-02-03 15:31:48.63	2025-12-05 03:00:00	2025-12-12 03:00:00	2025-12-12 03:00:00	-	0	\N	\N	\N	\N
233	AZURE EXPRESS ROUTE	OPTY2140	ENTREGUE	OR??AMENTO	Medium	\N	431	45	6	41	2026-02-03 15:31:48.652	2025-10-30 03:00:00	2025-12-22 03:00:00	2025-12-22 03:00:00	-	0	\N	\N	\N	\N
234	API/SDK GOOGLE MAPS	OPTY2253	ENTREGUE	OR??AMENTO	Medium	\N	482	45	6	102	2026-02-03 15:31:48.716	2025-11-26 03:00:00	2025-12-29 03:00:00	2025-12-29 03:00:00	-	0	\N	\N	\N	\N
235	IAAS/PAAS ORACLE	OPTY2282	ENTREGUE	OR??AMENTO	Medium	\N	421	45	6	37	2026-02-03 15:31:48.738	2025-12-05 03:00:00	2025-12-30 03:00:00	2025-12-30 03:00:00	-	0	\N	\N	\N	\N
236	AZURE EXPRESS ROUTE	OPTY2140	ENTREGUE	OR??AMENTO	Medium	\N	431	45	6	41	2026-02-03 15:31:48.776	2025-10-30 03:00:00	2026-01-06 03:00:00	2026-01-06 03:00:00	-	0	\N	\N	\N	\N
237	ALTERA????O DE PO E ESP	OPTY2276	ENTREGUE	PROPOSTA	Medium	\N	438	45	6	38	2026-02-03 15:31:48.797	2025-12-05 03:00:00	2026-01-07 03:00:00	2026-01-07 03:00:00	-	0	\N	\N	\N	\N
238	RH ESTRUTURANTE	OPTY1982	ENTREGUE	OR??AMENTO	Medium	\N	1	45	6	40	2026-02-03 15:31:48.825	2026-01-02 03:00:00	2026-01-08 03:00:00	2026-01-08 03:00:00	-	0	\N	\N	\N	\N
239	MICROSOFT CONTACT CENTER PLATFORM	OPTY2058	ENTREGUE	PROPOSTA	Medium	\N	431	45	6	56	2026-02-03 15:31:48.853	2025-10-17 03:00:00	2026-01-16 03:00:00	2026-01-16 03:00:00	-	0	\N	\N	\N	\N
240	MICROSOFT AZURE	OPTY2020	ENTREGUE	OR??AMENTO	Medium	\N	446	45	6	39	2026-02-03 15:31:48.886	2025-10-07 03:00:00	2026-01-16 03:00:00	2026-01-16 03:00:00	-	0	\N	\N	\N	\N
241	MICROSOFT AZURE	OPTY2020	ENTREGUE	OR??AMENTO	Medium	\N	446	45	6	39	2026-02-03 15:31:48.906	2025-10-07 03:00:00	2025-12-17 03:00:00	2025-12-17 03:00:00	-	0	\N	\N	\N	\N
242	MICROSOFT AZURE	OPTY2287	ENTREGUE	OR??AMENTO	Medium	\N	495	45	6	100	2026-02-03 15:31:48.947	2025-12-08 03:00:00	2025-12-08 03:00:00	2025-12-08 03:00:00	-	0	\N	\N	\N	\N
243	PAAS MIDDLEWARE	OPTY1641	ENTREGUE	OR??AMENTO	Medium	\N	451	45	6	49	2026-02-03 15:31:48.968	2025-08-15 03:00:00	2025-11-13 03:00:00	2025-11-13 03:00:00	-	0	\N	\N	\N	\N
244	MURALHA PAULISTA	OPTY2313	ENTREGUE	OR??AMENTO	Medium	\N	494	45	6	50	2026-02-03 15:31:48.987	2025-12-17 03:00:00	2025-12-22 03:00:00	2025-12-22 03:00:00	-	0	\N	\N	\N	\N
245	MULTICLOUD AWS/AZURE/GOOGLE	OPTY2338	ENTREGUE	OR??AMENTO	Medium	\N	464	45	7	103	2026-02-03 15:31:49.046	2025-12-19 03:00:00	2026-01-28 03:00:00	2026-01-28 03:00:00	-	0	\N	\N	\N	\N
251	SOU, E-FOLHA, HATS, SICAD	OPTY2513	EM ANDAMENTO	Proposta	Alta	0	1	104	2	38	2026-02-04 15:46:56.444	2026-01-26 12:00:00	2026-02-23 12:00:00	\N	\N	0	\N	\N	\N	\N
247	ESCALA MÉDICA - NUVEM PÚBLICA e APPS	OPTY2523	EM ANDAMENTO	Proposta	Média	1	1	104	6	38	2026-02-03 15:31:49.127	2026-01-27 12:00:00	2026-02-06 12:00:00	\N	-	0	\N	\N	\N	\N
192	SOLUÇÃO IA ATENDIMENTO ONLINE	OPTY1521	CONGELADA	Orçamento	Média	1	423	97	6	9	2026-02-03 15:31:47.485	2025-07-29 15:00:00	\N	\N	-	0	2026-02-06 00:19:14.765	\N	\N	\N
203	PAAS - GESTÃO REGULATÓRIA	OPTY2524	PENDENTE TRIAGEM	Orçamento	Medium	1	455	97	6	9	2026-02-03 15:31:47.779	2026-01-27 09:00:00	\N	\N	-	0	\N	\N	\N	\N
81	LICENÇAS POWER BI	OPTY1324	ENTREGUE	Orçamento	Baixa	1	451	63	6	9	2026-02-03 15:31:43.454	2025-06-24 09:00:00	2025-11-05 09:00:00	2025-11-05 09:00:00	-	0	\N	\N	\N	\N
1	ADIÇÃO DE 02 PERFIS DESENVOLVEDOR	RS-00604.2026	DESIGNADA	Proposta	Baixa	2	2	77	3	\N	2026-02-05 21:51:43.981961	2026-01-29 06:00:00	\N	\N	APP 2622.2026	0	\N	\N	\N	\N
2	INCLUSAO 01 ANALISTA ERP	RS-00605.2026	DESIGNADA	Proposta	Baixa	1	2	77	3	\N	2026-02-05 21:55:37.888255	2026-01-29 00:00:00	\N	\N	APP 2623.2026	0	\N	\N	\N	\N
3	INCLUSÇAO 01 COORDENDADOR	RS-00601.2026	DESIGNADA	Proposta	Baixa	1	2	77	3	\N	2026-02-05 21:57:34.178316	2026-02-03 00:00:00	\N	\N	ITOI 2057.2026	0	\N	\N	\N	\N
4	DETRAN TDV	RS-00607.2026	DESIGNADA	Proposta	Média	1	\N	77	3	\N	2026-02-05 21:59:48.176759	2026-02-05 00:00:00	\N	\N	\N	0	\N	\N	\N	\N
\.


--
-- Data for Name: finance_contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_contracts (id, client_name, pd_number, responsible_analyst, sei_process_number, sei_send_area, esps, created_at, updated_at) FROM stdin;
1	PREVIDÊNCIA SP	42343532343	Administrador	\N	\N	[{"esp_number": "43243234", "object_description": ""}]	2026-02-05 20:53:17.018729	2026-02-05 20:53:17.018729
\.


--
-- Data for Name: holidays; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.holidays (id, date, name) FROM stdin;
1	2026-01-01 03:00:00	Confraterniza????o Universal
2	2026-02-17 03:00:00	Carnaval
3	2026-04-03 03:00:00	Sexta-feira Santa
4	2026-04-21 03:00:00	Tiradentes
5	2026-05-01 03:00:00	Dia do Trabalho
6	2026-06-04 03:00:00	Corpus Christi
7	2026-09-07 03:00:00	Independ??ncia do Brasil
8	2026-10-12 03:00:00	Nossa Senhora Aparecida
9	2026-11-02 03:00:00	Finados
10	2026-11-15 03:00:00	Proclama????o da Rep??blica
11	2026-12-25 03:00:00	Natal
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, contract_id, invoice_number, amount, issue_date, status) FROM stdin;
\.


--
-- Data for Name: monthly_attestations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_attestations (id, contract_id, client_name, pd_number, responsible_analyst, esp_number, reference_month, report_generation_date, report_send_date, attestation_return_date, invoice_send_to_client_date, invoice_number, billed_amount, paid_amount, invoice_send_date, observations, created_at, sei_process_number, sei_send_area) FROM stdin;
1	1	PREVIDÊNCIA SP	42343532343	Administrador	43243234	2026-01	2026-01-05	2026-01-06	2026-01-09	2026-01-12	423423432	500000.00	475376.00	2026-01-19	Erro no apontamento DOP	2026-02-05 20:57:30.781059	432423423423432	\N
\.


--
-- Data for Name: requesters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requesters (id, name, email) FROM stdin;
2	FERNANDO VIDOI	fernando@prod.com
3	AMIM	amim@fluxo.com
4	MARTA	marta@fluxo.com
5	ANA LIDIA	lidia@fluxo.com
1	Jo??o Solicitante	solicitante@fluxo.com
6	RODRIGO BORGHESE TAMBASCO	rodrigo@fluxo.com
7	Solicitante CDPC	solicitante_cdpc@fluxo.com
\.


--
-- Data for Name: status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status_history (id, demand_id, from_status, to_status, changed_at, time_in_previous_status_minutes, changed_by) FROM stdin;
1	251	EM ANDAMENTO	DESIGNADA	2026-02-05 22:48:49.828	0	admin@prod.com
2	251	DESIGNADA	EM ANDAMENTO	2026-02-05 22:48:58.976	-180	admin@prod.com
3	247	EM QUALIFICA????O	EM QUALIFICAÇÃO	2026-02-05 22:49:44.858	0	admin@prod.com
4	247	EM QUALIFICAÇÃO	EM ANDAMENTO	2026-02-05 22:49:55.42	-180	admin@prod.com
5	228	PENDENTE TRIAGEM	TRIAGEM NÃO ELEGÍVEL	2026-02-05 23:45:31.506	0	admin@prod.com
6	228	TRIAGEM NÃO ELEGÍVEL	PENDENTE TRIAGEM	2026-02-05 23:45:37.232	-180	admin@prod.com
7	99	EM ANDAMENTO	DESIGNADA	2026-02-06 00:15:22.946	0	admin@prod.com
8	99	DESIGNADA	EM ANDAMENTO	2026-02-06 00:15:29.431	-180	admin@prod.com
9	192	CONGELADA	PENDENTE TRIAGEM	2026-02-06 00:19:07.516	0	admin@prod.com
10	192	PENDENTE TRIAGEM	CONGELADA	2026-02-06 00:19:14.765	-180	admin@prod.com
11	208	PENDENTE TRIAGEM	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:19:51.835	0	admin@prod.com
12	208	TRIAGEM NÃO ELEGÍVEL	PENDENTE TRIAGEM	2026-02-06 00:20:07.203	-180	admin@prod.com
13	203	PENDENTE TRIAGEM	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:20:46.883	0	admin@prod.com
14	203	TRIAGEM NÃO ELEGÍVEL	PENDENTE TRIAGEM	2026-02-06 00:20:55.798	-180	admin@prod.com
15	181	EM ANDAMENTO	DESIGNADA	2026-02-06 00:22:50.61	0	admin@prod.com
16	181	DESIGNADA	EM ANDAMENTO	2026-02-06 00:22:56.995	-180	admin@prod.com
17	161	CONGELADA	DESIGNADA	2026-02-06 00:23:34.126	0	admin@prod.com
18	161	DESIGNADA	CONGELADA	2026-02-06 00:23:42.77	-180	admin@prod.com
19	148	PEND??NCIA DDS	DESIGNADA	2026-02-06 00:24:20.671	0	admin@prod.com
20	148	DESIGNADA	PENDÊNCIA DDS	2026-02-06 00:24:25.834	-180	admin@prod.com
21	146	CONGELADA	DESIGNADA	2026-02-06 00:25:00.102	0	admin@prod.com
22	146	DESIGNADA	CONGELADA	2026-02-06 00:25:12.161	-180	admin@prod.com
23	118	EM QUALIFICA????O	DESIGNADA	2026-02-06 00:25:54.688	0	admin@prod.com
24	118	DESIGNADA	EM QUALIFICAÇÃO	2026-02-06 00:26:04.066	-180	admin@prod.com
25	113	PEND??NCIA FORNECEDOR	DESIGNADA	2026-02-06 00:26:52.301	0	admin@prod.com
26	113	DESIGNADA	PENDÊNCIA FORNECEDOR	2026-02-06 00:27:02.878	-180	admin@prod.com
27	111	PEND??NCIA DOP	DESIGNADA	2026-02-06 00:27:44.738	0	admin@prod.com
28	111	DESIGNADA	PENDÊNCIA DOP	2026-02-06 00:27:51.135	-180	admin@prod.com
29	110	DESIGNADA	PENDENTE TRIAGEM	2026-02-06 00:29:04.522	0	admin@prod.com
30	110	PENDENTE TRIAGEM	DESIGNADA	2026-02-06 00:29:09.372	-180	admin@prod.com
31	104	PEND??NCIA COMERCIAL	EM ANDAMENTO	2026-02-06 00:30:16.601	0	admin@prod.com
32	104	EM ANDAMENTO	PENDÊNCIA COMERCIAL	2026-02-06 00:30:24.36	-180	admin@prod.com
33	84	EM ANDAMENTO	DESIGNADA	2026-02-06 00:31:11.087	0	admin@prod.com
34	84	DESIGNADA	EM ANDAMENTO	2026-02-06 00:31:16.962	-180	admin@prod.com
35	33	EM ANDAMENTO	DESIGNADA	2026-02-06 00:32:10.553	0	admin@prod.com
36	33	DESIGNADA	EM ANDAMENTO	2026-02-06 00:32:16.082	-180	admin@prod.com
37	220	CONGELADA	DESIGNADA	2026-02-06 00:36:56.001	0	admin@prod.com
38	220	DESIGNADA	CONGELADA	2026-02-06 00:37:03.821	-180	admin@prod.com
39	191	CONGELADA	PENDENTE TRIAGEM	2026-02-06 00:37:52.142	0	admin@prod.com
40	191	PENDENTE TRIAGEM	CONGELADA	2026-02-06 00:38:04.355	-180	admin@prod.com
41	202	TRIAGEM N??O ELEG??VEL	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:38:53.481	0	admin@prod.com
42	227	TRIAGEM N??O ELEG??VEL	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:43:33.71	0	admin@prod.com
43	207	PENDENTE TRIAGEM	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:44:19.332	0	admin@prod.com
44	207	TRIAGEM NÃO ELEGÍVEL	PENDENTE TRIAGEM	2026-02-06 00:44:24.312	-180	admin@prod.com
45	214	TRIAGEM N??O ELEG??VEL	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:44:45.973	0	admin@prod.com
46	211	PENDENTE TRIAGEM	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:46:05.799	0	admin@prod.com
47	211	TRIAGEM NÃO ELEGÍVEL	PENDENTE TRIAGEM	2026-02-06 00:46:11.411	-180	admin@prod.com
48	212	PENDENTE TRIAGEM	TRIAGEM NÃO ELEGÍVEL	2026-02-06 00:46:32.073	0	admin@prod.com
49	212	TRIAGEM NÃO ELEGÍVEL	PENDENTE TRIAGEM	2026-02-06 00:46:37.494	-180	admin@prod.com
50	159	PEND??NCIA DDS	PENDÊNCIA DDS	2026-02-06 00:47:26.399	0	admin@prod.com
51	1	\N	DESIGNADA	2026-02-06 00:51:44.002	0	admin@prod.com
52	2	\N	DESIGNADA	2026-02-06 00:55:37.898	0	admin@prod.com
53	3	\N	DESIGNADA	2026-02-06 00:57:34.189	0	admin@prod.com
54	4	\N	DESIGNADA	2026-02-06 00:59:48.186	0	admin@prod.com
55	160	PEND??NCIA DDS	PENDÊNCIA DDS	2026-02-06 01:01:31.474	0	mari@cdpc.com
56	158	PEND??NCIA DOP	PENDÊNCIA DOP	2026-02-06 01:02:02.918	0	mari@cdpc.com
\.


--
-- Data for Name: termos_confirmacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.termos_confirmacao (id, numero_tc, contrato_associado_pd, numero_processo, data_inicio_vigencia, data_fim_vigencia, valor_total, objeto, area_demandante, fiscal_contrato, gestor_contrato, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, department, allowed_modules, profile_type) FROM stdin;
17	Gestor COCR	gestor_cocr@fluxo.com	123	manager	COCR	{contracts}	\N
18	Analista COCR	analista_cocr@fluxo.com	123	analyst	COCR	{contracts}	\N
19	Cliente COCR	cliente_cocr@fluxo.com	123	client	COCR	{contracts}	\N
20	LUCIANO PACHECO	luciano@cocr.com	1234	analyst	COCR	{contracts}	\N
21	RODRIGO BORGHESE TAMBASCO	rodrigo@cocr.com	1234	analyst	COCR	{contracts}	\N
22	PAULO MARCELLO DA SILVA FERREIRA	paulo@cocr.com	1234	analyst	COCR	{contracts}	\N
23	BARBARA ALMEIDA TUNES FERNANDES	barbara@cocr.com	1234	analyst	COCR	{contracts}	\N
24	CLEIA APARECIDA DA SILVA	cleia@cocr.com	1234	analyst	COCR	{contracts}	\N
25	JUNEIDY SOLANGE BETECA JONY	juneidy@cocr.com	1234	analyst	COCR	{contracts}	\N
26	AMANDA ESTEVES	amanda@cocr.com	1234	analyst	COCR	{contracts}	\N
27	KARINA FREIRE GRANDA SALLES	karina@cocr.com	1234	analyst	COCR	{contracts}	\N
28	DAIANE DA SILVA SOUZA	daiane@cocr.com	1234	analyst	COCR	{contracts}	\N
29	FRANCINE TANIGUCHI FALLEIROS DIAS	francine@cocr.com	1234	analyst	COCR	{contracts}	\N
30	NADIA BERTUCCELLI	nadia@cocr.com	1234	analyst	COCR	{contracts}	\N
31	MARTA MARIA NOVAES DE ALC??NTARA	marta@cocr.com	1234	analyst	COCR	{contracts}	\N
32	MARIA REGINA FUNICELLO	maria@cocr.com	1234	analyst	COCR	{contracts}	\N
33	ANA LIGIA SAPIENZA COLOMBO	ana@cocr.com	1234	analyst	COCR	{contracts}	\N
34	LUIS CLAUDINEI DA SILVA	luis@cocr.com	1234	analyst	COCR	{contracts}	\N
45	ROBSON	robson.1770121900670@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
48	SELMA/SUSAN	selma/susan.1770121900854@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
62	SELMA E GILENO	selma.e.gileno.1770121903125@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
67	VICTOR/ SUSAN	victor/.susan.1770121903531@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
16	Gerente Geral	gerente_gor@fluxo.com	123	general_manager	GOR	{flow,finance,contracts}	\N
42	EVELYN	evelyn@gc.com	123	requester	CDPC	{flow}	\N
66	AMIM	amim@gc.com	123	requester	CDPC	{flow}	\N
36	ADAIR	adair@cdpc.com	123	analyst	CDPC	{flow}	\N
51	AQUILA	aquila@cdpc.com	123	analyst	CDPC	{flow}	\N
53	ARIANE	ariane@cdpc.com	123	analyst	CDPC	{flow}	\N
63	CESAR	cesar@cdpc.com	123	analyst	CDPC	{flow}	\N
14	RAFAEL	rafael@cdpc.com	123	manager	CDPC	{flow}	\N
71	SELMA E VIDOI	selma.e.vidoi.1770121903971@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
72	LUCIANA	luciana.1770121904030@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
73	VICTOR/AMIM	victor/amim.1770121904100@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
52	WALTZ	waltz@gor.com	123	manager	GOR	{flow,finance,contracts}	\N
68	DENIS	denis@cdpc.com	123	analyst	CDPC	{flow}	\N
58	LEANDRO	leandro@cdpc.com	123	requester	CDPC	{flow}	\N
54	REINALDO	reinaldo@gc.com	123	requester	CDPC	{flow}	\N
38	SUSAN	susan@gc.com	123	requester	CDPC	{flow}	\N
55	SUSIANE	susiane@gc.com	123	requester	CDPC	{flow}	\N
60	PAULO	paulo@gc.com	123	requester	CDPC	{flow}	\N
76	LUCIANA/ MARCIA	luciana/.marcia.1770121904745@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
83	VICTOR / SUSAN	victor./.susan.1770121905439@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
86	SELMA/ VICTOR	selma/.victor.1770121905625@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
87	LUCIANA E ROBSON	luciana.e.robson.1770121905765@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
89	VICTOR / SUSI	victor./.susi.1770121906082@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
91	VIDOI/ REINALDO	vidoi/.reinaldo.1770121906491@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
92	SELMA/ SUSAN	selma/.susan.1770121906529@fluxo.temp	mudar123	requester	CDPC	{flow}	\N
105	THIAGO	thiago@cdpc.com	123	manager	CDPC	{flow}	\N
104	SAMUEL	samuel@cdpc.com	123	manager	CDPC	{flow}	\N
103	MARCIA	marcia@gc.com	123	requester	CDPC	{flow}	\N
102	THAIS	thais@gc.com	123	requester	CDPC	{flow}	\N
101	OSVALDO	osvaldo@gc.com	123	requester	CDPC	{flow}	\N
100	WALTER	walter@gc.com	123	requester	CDPC	{flow}	\N
99	VICTOR	victor@gc.com	123	requester	CDPC	{flow}	\N
98	VIDOI	vidoi@gc.com	123	requester	CDPC	{flow}	\N
96	DEBORA	debora@gc.com	123	requester	CDPC	{flow}	\N
95	MICHEL	michel@gc.com	123	requester	CDPC	{flow}	\N
94	SELMA	selma@gc.com	123	requester	CDPC	{flow}	\N
93	NATANAEL	natanael@cdpc.com	123	analyst	CDPC	{flow}	\N
69	BARANDA	baranda@gc.com	123	requester	CDPC	{flow}	\N
77	JAIR	jair@cdpc.com	123	analyst	CDPC	{flow}	\N
106	VICTORIA	victoria@cocr.com	123	manager	COCR	{contracts}	\N
107	Gestor CDPC	gestor_cdpc@fluxo.com	123	manager	CDPC	{flow}	\N
109	Solicitante CDPC	solicitante_cdpc@fluxo.com	123	requester	CDPC	{flow}	\N
110	Gestor CVAC	gestor_cvac@fluxo.com	123	manager	CVAC	{finance}	\N
111	Analista CVAC	analista_cvac@fluxo.com	123	analyst	CVAC	{finance}	\N
112	Administrador	admin@prod.com	123	admin	GOR	{flow,finance,contracts}	\N
75	ANDRÉA	andrea@gc.com	123	requester	CDPC	{flow}	\N
78	CLEIA	cleia@gc.com	123	requester	CDPC	{flow}	\N
74	FERNANDA	fernanda@cdpc.com	123	analyst	CDPC	{flow}	\N
84	FLAVIA	flavia@gc.com	123	requester	CDPC	{flow}	\N
80	LUCAS	lucas@cdpc.com	123	analyst	CDPC	{flow}	\N
90	MARI	mari@cdpc.com	123	analyst	CDPC	{flow}	\N
11	Analista CDPC	analista_cdpc@fluxo.com	123	analyst	CDPC	{flow}	\N
13	HERICK	herick@cvac.com	123	analyst	CVAC	{finance}	\N
35	CRISTIANE	cristiane@cvac.com	123	manager	CVAC	{finance}	\N
\.


--
-- Name: analysts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analysts_id_seq', 4, true);


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 1, true);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contracts_id_seq', 1, false);


--
-- Name: cycles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cycles_id_seq', 1, false);


--
-- Name: deadline_contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.deadline_contracts_id_seq', 1, false);


--
-- Name: demands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.demands_id_seq', 4, true);


--
-- Name: finance_contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_contracts_id_seq', 1, true);


--
-- Name: holidays_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.holidays_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: monthly_attestations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monthly_attestations_id_seq', 1, true);


--
-- Name: requesters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requesters_id_seq', 1, true);


--
-- Name: status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_history_id_seq', 56, true);


--
-- Name: termos_confirmacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.termos_confirmacao_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 36, true);


--
-- Name: analysts analysts_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysts
    ADD CONSTRAINT analysts_name_key UNIQUE (name);


--
-- Name: analysts analysts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analysts
    ADD CONSTRAINT analysts_pkey PRIMARY KEY (id);


--
-- Name: clients clients_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_name_key UNIQUE (name);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_contract_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_contract_number_key UNIQUE (contract_number);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: cycles cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cycles
    ADD CONSTRAINT cycles_pkey PRIMARY KEY (id);


--
-- Name: deadline_contracts deadline_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deadline_contracts
    ADD CONSTRAINT deadline_contracts_pkey PRIMARY KEY (id);


--
-- Name: demands demands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demands
    ADD CONSTRAINT demands_pkey PRIMARY KEY (id);


--
-- Name: finance_contracts finance_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_contracts
    ADD CONSTRAINT finance_contracts_pkey PRIMARY KEY (id);


--
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: monthly_attestations monthly_attestations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_attestations
    ADD CONSTRAINT monthly_attestations_pkey PRIMARY KEY (id);


--
-- Name: requesters requesters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requesters
    ADD CONSTRAINT requesters_pkey PRIMARY KEY (id);


--
-- Name: status_history status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_pkey PRIMARY KEY (id);


--
-- Name: termos_confirmacao termos_confirmacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.termos_confirmacao
    ADD CONSTRAINT termos_confirmacao_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: demands demands_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demands
    ADD CONSTRAINT demands_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id);


--
-- Name: invoices invoices_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id);


--
-- Name: monthly_attestations monthly_attestations_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.monthly_attestations
    ADD CONSTRAINT monthly_attestations_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.finance_contracts(id);


--
-- Name: status_history status_history_demand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_history
    ADD CONSTRAINT status_history_demand_id_fkey FOREIGN KEY (demand_id) REFERENCES public.demands(id);


--
-- PostgreSQL database dump complete
--

\unrestrict rUsRuJR6lpkDbPq6E9Gi7TO4JHDPgr0KE0geFScUgbsrj3CpzGL4MoYBWOZJDl1

